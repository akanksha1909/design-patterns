import { createChat } from './db.js';
import { publisher } from './redis.js';

const CONTROL_CHANNEL = 'system:control';
import { groupInfo } from './server.js';

export async function handleCreateChat(ws, payload, requestId) {
    const { name, participants } = payload;
    const ack = { action: 'ack', requestId };

    if (!name || !Array.isArray(participants) || participants.length < 2) {
        ws.send(JSON.stringify({ ...ack, status: 'error', message: 'Group Name and an array of participants are required.' }));
        return;
    }

    try {
        const newChat = await createChat(name, participants);
        if (!newChat) {
            throw new Error('Database operation failed to return a new group.');
        }

        console.log(`New Chat Group ${JSON.stringify(newChat)}`)

        // Announce the new group to all servers so they can subscribe
        await publisher.publish(CONTROL_CHANNEL, JSON.stringify({
            event: 'newChatGroup',
            group: newChat
        }));

        // Send a success ACK back to the creator with the new group details
        ws.send(JSON.stringify({ ...ack, status: 'ok', payload: newChat }));
    } catch (error) {
        console.error('Failed to create chat:', error);
        ws.send(JSON.stringify({ ...ack, status: 'error', message: 'Failed to create chat group.' }));
    }
}

/**
 * Handles the 'sendMessage' action from a WebSocket client.
 *
 * @param {WebSocket} ws - The WebSocket connection of the client who sent the message.
 * @param {object} payload - The data payload, containing { groupId, senderId, content }.
 * @param {string} requestId - The client-generated request ID for the acknowledgement.
 */
export async function handleSendMessage(ws, payload, requestId) {
    // Prepare a base acknowledgement object to be sent back to the sender.
    const ack = { action: 'ack', requestId };

    try {
        // 1. PERSISTENCE: Save the message to DynamoDB first. This is our source of truth.
        // The saveMessage function returns the full message object, including the server-generated timestamp.
        // const savedMessage = await saveMessage(payload);
        const savedMessage = {
            "chatId": payload.chatId,
            "senderId": payload.senderId,
            "content": payload.message,
            "timestamp": new Date()
        }

        // 2. ACKNOWLEDGEMENT: If saving succeeds, send a success ACK back to the original sender immediately.
        // This gives the sender's UI instant feedback ("message sent").
        ws.send(JSON.stringify({
            ...ack,
            status: 'ok',
            payload: { timestamp: savedMessage.timestamp }
        }));

        // 3. DISTRIBUTION: Publish the full, saved message to the Redis channel for this group.
        // This will broadcast the message to all other servers, which will then send it to
        // the other group members.
        const channel = `chat:${payload.chatId}`;
        // await publisher.publish(channel, JSON.stringify(savedMessage));
        console.log(`Details of groupInfo ${groupInfo}`)
        const members = groupInfo.get(payload.chatId);
        if (!members) {
            console.error(`[Fan-out Error] Group members not found for groupId: ${payload.chatId}. Was the group created correctly?`);
            // Optionally send an error ack back to the user
            // ws.send(JSON.stringify({ ...ack, status: 'error', message: 'Group not found for sending.' }));
            return;
        }
        for (const memberId of members) {
            // As requested, we will not send the message back to the original sender's topic.
            if (memberId !== payload.senderId) {
                const userTopic = `user:${memberId}`;
                await publisher.publish(userTopic, JSON.stringify(savedMessage));
            }
        }

    } catch (error) {
        // ERROR HANDLING: This block runs if the `saveMessage` call fails.
        console.error('Failed to handle message:', error);

        // Send a failure ACK back to the original sender so their UI can show an error.
        ws.send(JSON.stringify({
            ...ack,
            status: 'error',
            message: 'Failed to save or publish message'
        }));
    }
}