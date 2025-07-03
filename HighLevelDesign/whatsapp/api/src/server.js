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
import { subscriber } from './redis.js';

import { handleSendMessage, handleCreateChat } from './handlers.js';

const app = express();
const server = http.createServer(app);
const CONTROL_CHANNEL = 'system:control';

// Contains the key: groupId, value: members in the group
export const groupInfo = new Map();

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

      // --- NEW BEHAVIOR: Subscribe to the user's personal topic ---
    const userTopic = `user:${userId}`;
    
    subscriber.subscribe(userTopic, (messagePayload) => {
        console.log(`[${SERVER_ID}] Received direct message for ${userId} from Redis on topic ${userTopic}.`);
        
        // The job of this server is now very simple:
        // If a message arrives on this user's topic, forward it directly
        // to their WebSocket connection.
        ws.send(messagePayload);
    });
    console.log(`[${SERVER_ID}] Subscribed to Redis topic: ${userTopic}`);

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

// Old logic of processing on chat:chatId
const subscribeToGroupChannel = (chatId) => {
    const channel = `chat:${chatId}`;
    subscriber.subscribe(channel, (messagePayload) => {
        console.log(`[${SERVER_ID}] Received message from Redis on channel ${channel}`);
        const message = JSON.parse(messagePayload);
        const messageToSend = JSON.stringify({ action: 'receiveMessage', payload: message });
        const members = groupInfo.get(message.chatId) || [];
        members.forEach(memberId => {
            const clientWs = clients.get(memberId);
            if (clientWs && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(messageToSend);
            }
        });
    });
    console.log(`[${SERVER_ID}] Subscribed to Redis channel: ${channel}`);
};

// --- Redis Subscription Logic (No change) ---
subscriber.subscribe(CONTROL_CHANNEL, (messagePayload) => {
    console.log("Coming to Subscribed channel")
    const message = JSON.parse(messagePayload);
    if (message.event === 'newChatGroup') {
        const { group } = message;
        console.log(`[${SERVER_ID}] Learned of new group via control channel: ${group.chatId}`);
        groupInfo.set(group.chatId, group.participants);
        // subscribeToGroupChannel(group.chatId);
    }
});

console.log(`[${SERVER_ID}] Subscribed to system control channel: ${CONTROL_CHANNEL}`);

server.listen(PORT, () => {
    console.log(`Server ${SERVER_ID} is listening on http://localhost:${PORT}`);
});