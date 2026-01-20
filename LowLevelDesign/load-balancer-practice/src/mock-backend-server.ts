import express from 'express';

const SERVER_ID = process.env.SERVER_ID;
const PORT = process.env.PORT;
const app = express();

app.use(express.json());

const delay = (ms) => new Promise(res => setTimeout(res, ms));

app.post('/api/users', async (req, res) => {
    console.log("here")
    await delay(Math.random() * 100); // Random delay 0-100ms
    res.json({
        success: true,
        data: [
            { id: 1, name: 'User 1', server: SERVER_ID },
            { id: 2, name: 'User 2', server: SERVER_ID },
            { id: 3, name: 'User 3', server: SERVER_ID }
        ],
        serverId: SERVER_ID,
        port: PORT
    });
});

app.listen(PORT, () => {
    console.log(`✅ Mock Backend Server ${SERVER_ID} running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
});
