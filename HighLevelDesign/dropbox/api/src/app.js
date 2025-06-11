// src/app.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const fileRoutes = require('./routes/file.routes');
const s3Controller = require('./controllers/s3.controller');

const app = express();
app.use(express.json());

app.use('/api/v1/files', fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});