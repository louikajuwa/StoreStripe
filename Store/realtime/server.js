const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:8000'],
        methods: ['GET', 'POST'],
    },
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/broadcast-payment', (req, res) => {
    const { secret, payment } = req.body;

    if (secret !== process.env.API_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    io.emit('payment-updated', payment);
    console.log('Broadcasted payment update:', payment.id);
    res.json({ success: true });
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Realtime server running on port ${PORT}`);
});
