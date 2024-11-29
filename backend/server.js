

// import express from 'express';
// import cors from 'cors';
//import mysql from 'mysql2/promise';
//import dotenv from 'dotenv';
const express = require('express');
const cors =  require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



//Routes
app.use('/api/v1', require('./routes/code'));

const PORT  =  5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

