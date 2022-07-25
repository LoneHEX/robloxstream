import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
    port: 90
});

wss.on('connection', ws => {
    console.log('Got connection!');
});

wss.on('listening', () => {
    console.log('WebSocket server listening!');
})