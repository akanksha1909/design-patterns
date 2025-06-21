import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({
    region: '',
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "whatsapp";

export const createChat = async (chatName, participants) => {
    const chatId = uuidv4();
    const now = new Date().toISOString();

    const chatMetadata = {
        TableName: TABLE_NAME,
        Item: {
            PK: `CHAT#${chatId}`,
            SK: 'METADATA',
            chatName,
            createdAt: now,
            participants,
        },
    };

    try {
        // 1. Create the chat metadata
        await docClient.send(new PutCommand(chatMetadata));
        console.log(`Created chat metadata for ${chatId}`);

        // 2. Create membership records (for easily finding chats per user, etc.)
        for (const participantId of participants) {
            const participant = {
                TableName: TABLE_NAME,
                Item: {
                    PK: `CHATPARTICIPANT#${participantId}`,
                    SK: `CHAT#${chatId}`
                }
            };
            await docClient.send(new PutCommand(participant));
        }

        return { chatId, chatName, participants };

    } catch (err) {
        console.error("Error creating chat in DynamoDB", err);
        return null;
    }
};
