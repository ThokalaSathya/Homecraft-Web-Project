const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/homecraft', {})
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Create a schema for crafts
const craftSchema = new mongoose.Schema({
    title: String,
    description: String,
    filePath: String, // Change 'image' to 'filePath'
    fileType: String   // Add a new field for file type (image/video)
});

// Create a model for the crafts
const Craft = mongoose.model('Craft', craftSchema);

// Middleware for serving static files
app.use(express.static(path.join(__dirname))); // Serve everything in the root directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Set up storage for file uploads
const storage = multer.diskStorage({
    destination: './uploads/', // Directory for uploaded files
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Accept both images and videos
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB file size limit
    fileFilter: (req, file, cb) => {
        // Accept only images and videos
        const filetypes = /jpeg|jpg|png|gif|mp4|mkv|webm|avi|mov/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: File upload only supports the following filetypes - ' + filetypes);
        }
    }
}).single('craftFile'); // Change 'craftImage' to 'craftFile'

// Serve the dashboard.html as the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Serve the upload.html at /upload path
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});

// Serve the gallery.html at /gallery path
app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'gallery.html'));
});

// Handle file upload
app.post('/upload', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.send('Error uploading file: ' + err.message);
        }

        // Create a new craft document
        const craft = new Craft({
            title: req.body.craftTitle,
            description: req.body.craftDescription,
            filePath: `/uploads/${req.file.filename}`, // URL to access the uploaded file
            fileType: req.file.mimetype // Store the file type
        });

        try {
            // Save the craft to the database
            await craft.save();
            res.redirect('/gallery'); // Redirect to the gallery page after upload
        } catch (error) {
            console.error('Error saving craft to database:', error);
            res.send('Error saving craft to database');
        }
    });
});

// API endpoint to get crafts data
app.get('/api/crafts', async (req, res) => {
    try {
        const crafts = await Craft.find(); // Retrieve all crafts from the database
        res.json(crafts); // Send crafts array as JSON
    } catch (error) {
        console.error('Error fetching crafts:', error);
        res.status(500).send('Error fetching crafts');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
