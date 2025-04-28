const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const route = require('./routes/route');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

// Use routes
app.use('/api', route);

// Database connection
mongoose.connect('mongodb://localhost:27017/shopData')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


 const PORT = process.env.PORT || 3001;
 app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
 });