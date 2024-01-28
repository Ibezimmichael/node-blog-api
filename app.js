const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const users = require('./routes/user');
const posts = require('./routes/post');
const comments = require('./routes/comment');
const categories = require('./routes/category');
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middlewares/errorHandler');
connectDb()

const port = process.env.PORT || 5000;

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// users route
app.use('/api/users/', users);

// posts route
app.use('/api/posts/', posts);

// commentd route
app.use('/api/comments/', comments);

// categories route

app.use('/api/categories/', categories);


app.use(errorHandler);

app.use('*', (req, res) => {
    res.status(404).json({message: `${req.originalUrl} Route Not found`})
})



app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
})