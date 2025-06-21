import { createChat } from './db.js';

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

        // console.log(`New Chat Group ${JSON.stringify(newChat)}`)

        // Announce the new group to all servers so they can subscribe
        // await publisher.publish(CONTROL_CHANNEL, JSON.stringify({
        //     event: 'newGroup',
        //     group: newGroup
        // }));

        // Send a success ACK back to the creator with the new group details
        ws.send(JSON.stringify({ ...ack, status: 'ok', payload: newChat }));
    } catch (error) {
        console.error('Failed to create chat:', error);
        ws.send(JSON.stringify({ ...ack, status: 'error', message: 'Failed to create chat group.' }));
    }
}

export async function handleSendMessage(ws, payload) {
}