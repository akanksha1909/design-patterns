// src/routes/file.routes.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const s3 = require('../config/s3Client');

const router = express.Router();

// This endpoint returns presigned url for a given file
router.post('/presigned-url', async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        if (!fileName || !fileType) {
            return res.status(400).send({ error: 'fileName and fileType are required.' });
        }

        const fileId = uuidv4();
        const key = `${fileId}/${fileName}`; // Store files in a folder-like structure using their ID

        // TODO: Create an entry in your PostgreSQL database here with status 'PENDING'
        // await db.query('INSERT INTO files (id, name, status) VALUES ($1, $2, $3)', [fileId, fileName, 'PENDING']);
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
            Expires: 60 * 5, // URL expires in 5 minutes
        };

        const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

        res.status(200).send({
            fileId,
            uploadUrl,
            key
        });

    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).send({ error: 'Could not generate upload URL.' });
    }
});

// This endpoint returns presigned url to a client to download a file
router.get('/:fileId/presigned-url', async (req, res) => {

});


module.exports = router;