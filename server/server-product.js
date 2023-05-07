const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Create an object to store the brightness states for each productId
const brightnessStates = {};

app.use(cors());
app.use(express.json());

app.get('/api/brightness/:productId', (req, res) => {
  const { productId } = req.params;
  // Return the brightness state for the productId
  res.json({
    isOn: brightnessStates[productId] || false
  });
});

app.post('/api/brightness/:productId', (req, res) => {
  const { productId } = req.params;
  const { isOn } = req.body;
  // Update the brightness state for the productId
  brightnessStates[productId] = isOn;

  // Send the new brightness state to all clients listening to the productId
  wss.clients.forEach(client => {
    if (client.productId === productId) {
      client.send(JSON.stringify({
        isOn
      }));
    }
  });

  res.sendStatus(200);
});

wss.on('connection', (ws) => {
  // Store the productId of the client connection
  const productId = ws.upgradeReq.url.split('/')[2];
  ws.productId = productId;

  // Send the initial brightness state for the productId to the client
  ws.send(JSON.stringify({
    isOn: brightnessStates[productId] || false
  }));
});

server.listen(3001, () => {
  console.log('Server started on port 3001');
});

process.stdin.resume();
process.stdin.setEncoding('utf8');
console.log('Enter "productId on" or "productId off" to update Brightness:');

process.stdin.on('data', (data) => {
  data = data.trim().toLowerCase();
  const parts = data.split(' ');

  if (parts.length === 2 && (parts[1] === 'on' || parts[1] === 'off')) {
    const productId = parts[0];
    const isOn = parts[1] === 'on';
    // Update the brightness state for the productId
    brightnessStates[productId] = isOn;

    console.log(`Sending BRIGHTNESS: ${isOn ? 'ON' : 'OFF'} for product ${productId}`);

    // Send the new brightness state to all clients listening to the productId
    wss.clients.forEach(client => {
      if (client.productId === productId) {
        client.send(JSON.stringify({
          isOn
        }));
      }
    });
  } else {
    console.log('Invalid input. Enter "productId on" or "productId off".');
  }
});
