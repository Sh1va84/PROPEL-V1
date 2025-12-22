require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/utils/socket');

const PORT = process.env.PORT || 5000;

// Create HTTP server (needed for Socket.io)
const server = http.createServer(app);

// Initialize Real-time communication
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});