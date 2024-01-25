const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const users = require('./routes/user');
const posts = require('./routes/post');
const comments = require('./routes/comment');
const categories = require('./routes/category');
const connectDb = require('./config/dbConnection');
connectDb()

const port = process.env.PORT || 5000;

// users route
app.use('/api/users/', users);

// posts route
app.use('/api/posts/', posts);

// commentd route
app.use('/api/comments/', comments);

// categories route

app.use('/api/categories/', categories);








app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
})