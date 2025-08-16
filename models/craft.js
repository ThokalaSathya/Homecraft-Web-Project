const mongoose = require('mongoose');

const craftSchema = new mongoose.Schema({
    title: req.body.craftTitle,
    description: req.body.craftDescription,
    filePath: `/uploads/${req.file.filename}`, // URL to access the uploaded file
    fileType: req.file.mimetype // Store the file type
});



module.exports = mongoose.model('Craft', craftSchema);
