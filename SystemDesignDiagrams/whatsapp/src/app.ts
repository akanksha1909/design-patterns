import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express()

const server = http.createServer(app)

const wss = new WebSocketServer({ server })

wss.on('connection', (ws, req) => {
    ws.on('message', (data) => {
        let newUrl = new URL(req.url, `http://${req.headers.host}`)
        console.log(newUrl)
        const userId = newUrl.searchParams.get("userId")
        console.log(userId)
        console.log("Data Received: ", JSON.parse(data))
    })

    ws.on('close', () => {
        console.log('Connection closed')
    })

    ws.on('error', (error) => {
        console.log('Error', error)
    })
})


server.listen(8080, () => {
    console.log(`Server is listening on http://localhost:8080}`);
});