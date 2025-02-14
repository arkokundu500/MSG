const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const response = `[${timestamp}] ${message}`;
    ws.send(response); 
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});