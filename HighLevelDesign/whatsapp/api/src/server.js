import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate the behavior of __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file in the project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

import { handleSendMessage, handleCreateChat } from './handlers.js';

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });
// Simple in-memory store for connected clients on this server instance
// In a real app, this might be more robust (e.g., mapping userId to ws connection)
const clients = new Map();
const PORT = process.env.PORT || 8080;
const SERVER_ID = process.env.SERVER_ID || 'default-server';

wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId');
    if (!userId) {
        ws.close(1008, "User ID is required");
        return;
    }
    console.log(`Client ${userId} connected to server ${SERVER_ID}`);
    clients.set(userId, ws);

    ws.on('message', async (rawMessage) => {
        let message;
        try {
            message = JSON.parse(rawMessage);
        } catch (e) {
            console.error('Invalid JSON received');
            return;
        }

        const { action, payload } = message;
        switch (action) {
            case 'createChat':
                handleCreateChat(ws, payload);
                break
            case 'sendMessage':
                handleSendMessage(ws, payload);
                break
            default:
                console.log(`Unknown action: ${action}`)
        }
    });

    ws.on('close', () => {
        console.log(`Client ${userId} disconnected from server ${SERVER_ID}`);
        clients.delete(userId);
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error for ${userId}:`, error);
    });
});

server.listen(PORT, () => {
    console.log(`Server ${SERVER_ID} is listening on http://localhost:${PORT}`);
});