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
router.get('/:fileId/:fileName/presigned-url', async (req, res) => {
    const { fileId, fileName } = req.params;

    if (!fileName) {
        return res.status(400).send('Filename is required.');
    }

    const key = `${fileId}/${fileName}`; // Store files in a folder-like structure using their ID

    // These are the parameters for the getObject operation
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key, // The full key (path) of the object in your S3 bucket
        Expires: 60 * 5, // The URL will be valid for 5 minutes

        // This is a best-practice header. It tells the browser to treat this
        // as an attachment and suggests a filename for the "Save As..." dialog.
        // It's helpful for files that shouldn't be displayed in the browser.
        // For images you want to display, you might omit this.
        ResponseContentDisposition: `attachment; filename="${fileName}"`
    };

    try {
        // First, check if the object actually exists in S3 to avoid generating a bad link
        await s3.headObject({ Bucket: params.Bucket, Key: params.Key }).promise();

        // If it exists, generate the pre-signed URL
        const url = await s3.getSignedUrlPromise('getObject', params);

        // --- The Redirect ---
        // Respond with a 302 redirect, sending the user's browser to the S3 URL
        console.log(`Redirecting to pre-signed download URL for ${fileName}. URL is: ${url}`);
        res.redirect(url);

    } catch (error) {
        // The headObject check will throw an error if the file is not found
        if (error.name === 'NotFound' || error.code === 'NotFound') {
            console.warn(`File not found in S3: ${filename}`);
            return res.status(404).send('File not found.');
        }

        // Handle other potential errors
        console.error('Error generating download URL:', error);
        return res.status(500).send('Could not generate download URL.');
    }
});


module.exports = router;