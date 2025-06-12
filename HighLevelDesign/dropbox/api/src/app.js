// src/app.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const fileRoutes = require('./routes/file.routes');
const s3Controller = require('./controllers/s3.controller');
const { MessageValidator } = require('aws-sns-validator'); // Import validator
const bodyParser = require('body-parser');

const app = express();

const validator = new MessageValidator();

app.post(
    '/webhooks/s3-notification',
    // 1. Use the built-in express.raw() middleware
    bodyParser.raw({
        type: '*/*',
        verify: (req, res, buf) => {
            req.rawBody = buf;
        }
    }),
    (req, res) => {
        // NOTE: Now, req.body is UNDEFINED here because express.raw doesn't parse it.
        // We MUST use the req.rawBody that we saved in the verify function.
        let message;
        try {
            message = JSON.parse(req.rawBody.toString());
        } catch (e) {
            console.error("Failed to parse SNS message JSON:", e);
            return res.status(400).send("Invalid JSON format.");
        }
        console.log("⏳ Calling validator.validate()... Waiting for it to fetch cert and complete.");
        validator.validate(message, (err) => {
            console.log("➡️ Validator callback has been executed!");

            if (err) {
                console.error('SNS Signature Validation Error:', err);
                return res.status(403).send('Forbidden: Invalid Signature');
            }
            console.log("✅ SNS Signature Validation Successful.");

            // Validation successful
            res.status(200).send('OK'); // Respond immediately

            // The 'message' argument is the validated message content.
            // It's good practice to use this one for processing.
            handleSnsMessage(message);
        });
        console.log("🚀 Webhook handler function has finished its synchronous execution.");
    }
);

async function handleSnsMessage(message) {
    // This 'if' block checks the type of message received from SNS.
    if (message.Type === 'SubscriptionConfirmation') {

        console.log('Received SNS Subscription Confirmation.');

        // THIS IS THE LINE THAT PRINTS THE URL TO YOUR CONSOLE
        console.log('You MUST visit this URL to activate the webhook:');
        console.log(message.SubscribeURL);

    } else if (message.Type === 'Notification') {
        console.log('Received a validated S3 notification.');

        // The actual S3 event is a JSON string inside the 'Message' property.
        // We need to parse IT to get to the { Records: [...] } object.
        const s3Event = JSON.parse(message.Message);

        if (s3Event.Records) {
            for (const record of s3Event.Records) {
                await processS3Record(record);
            }
        } else {
            console.warn("SNS notification received, but it contained no S3 records.", s3Event);
        }
    }
}

async function processS3Record(record) {
    // ---
    // DO NOT VALIDATE HERE
    // 'record' is just one part of the S3 event, not a validatable SNS message.
    // ---
    const objectKey = record.s3.object.key;
    console.log(`Processing completion for S3 object: ${objectKey}`);
    // ... your database logic goes here ...
}

app.use(express.json());

app.use('/api/v1/files', fileRoutes);

app.get('/', (req, res) => res.send('Hello world!'));

process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', reason => {
    console.error('Unhandled Rejection:', reason);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
    console.log(`✅ Server is running on port ${PORT}`);
});