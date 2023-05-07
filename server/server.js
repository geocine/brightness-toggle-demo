const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


let isOn = false;

app.use(cors());

app.use(express.json());

app.get('/api/brightness', (req, res) => {
  res.json({
    isOn
  });
});

app.post('/api/brightness', (req, res) => {
  isOn = req.body.isOn;
  // do not send brightness to client if it was changed by client
  wss.clients.forEach(client => {
    client.send(JSON.stringify({
      isOn
    }));
  });
  res.sendStatus(200);
});

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({
    isOn
  }));
});

server.listen(3001, () => {
  console.log('Server started on port 3001');
});

process.stdin.resume();
process.stdin.setEncoding('utf8');
console.log('Enter "on" or "off" to update Brightness:');

process.stdin.on('data', (data) => {
  data = data.trim().toLowerCase();
  if (data === 'on' || data === 'off') {
    isOn = data === 'on';
    console.log('Sending BRIGHTNESS: ' + (isOn ? 'ON' : 'OFF'))
    wss.clients.forEach(client => {
      client.send(JSON.stringify({
        isOn
      }));
    });
  } else {
    console.log('Invalid input. Enter "on" or "off".');
  }
});
