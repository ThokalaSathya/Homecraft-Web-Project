const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Craft = require('./models/craft'); // Import the Craft model

const app = express();
const PORT = 3001;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/homecrafthub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where the files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, 'craftImage-' + Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// Middleware to parse JSON bodies
app.use(bodyParser.json({ limit: '10mb' })); // Allow larger payloads for images

// Serve static files (for your HTML, JS, and other assets)
app.use(express.static(__dirname));

// Endpoint to handle craft uploads
app.post('/upload-craft', upload.single('craftImage'), (req, res) => {
    const newCraft = new Craft({
        title: req.body.craftTitle,
        description: req.body.craftDescription,
        image: req.file.filename // Save the uploaded file's name
    });

    // Save the craft to the database
    newCraft.save()
    .then(() => {
        res.status(200).send('Craft uploaded successfully!');
    })
    .catch(err => {
        console.error('Error saving craft to MongoDB:', err);
        res.status(500).send('Server error.');
    });
});

// Endpoint to serve the uploaded crafts data as JSON
app.get('/uploads', (req, res) => {
    Craft.find()
    .then(crafts => {
        res.json(crafts);
    })
    .catch(err => {
        console.error('Error fetching crafts from MongoDB:', err);
        res.status(500).send('Server error.');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
