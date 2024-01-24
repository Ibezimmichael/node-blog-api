const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectDb = require('./config/dbConnection')
connectDb()

const port = process.env.PORT || 5000;








app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
})