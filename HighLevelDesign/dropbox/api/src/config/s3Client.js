// src/config/s3Client.js
const AWS = require('aws-sdk');
require('dotenv').config({ path: '../../.env' });

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    region: process.env.S3_REGION,
});

module.exports = s3;