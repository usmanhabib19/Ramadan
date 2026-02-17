import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Request Logger (Move to top to see all requests)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Essential Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory (Vite build output)
const distPath = path.join(__dirname, 'dist');
console.log('Static files path:', distPath);
if (fs.existsSync(distPath)) {
    console.log('✅ Dist folder found!');
    app.use(express.static(distPath));
} else {
    console.warn('⚠️ Dist folder NOT found! Did you run "npm run build"?');
}

// MongoDB Connection with Retry Logic
const connectWithRetry = () => {
    console.log('Attempting MongoDB connection...');
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Successfully connected to MongoDB');
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
            console.log('Retrying in 5 seconds...');
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

// Chat Schema
const chatSchema = new mongoose.Schema({
    question: String,
    answer: String,
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

// Member Schema
const memberSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    joinedAt: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);

// Community Message Schema
const messageSchema = new mongoose.Schema({
    name: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Active Session Schema for Live Online Count
const sessionSchema = new mongoose.Schema({
    identifier: { type: String, unique: true }, // IP or Session ID
    lastActive: { type: Date, default: Date.now }
});

const ActiveSession = mongoose.model('ActiveSession', sessionSchema);

// OpenAI Configuration
let openai = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
} else {
    console.warn('WARNING: OPENAI_API_KEY is missing. AI chat features will be disabled.');
}

// Routes
app.post('/api/chat', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        if (!openai) {
            return res.status(503).json({ error: 'AI features are currently unavailable. Please configure the OpenAI API key.' });
        }

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant specialized in Ramadan. Provide accurate, spiritual, and helpful information about Ramadan, fasting, prayer times, and Islamic traditions." },
                { role: "user", content: question },
            ],
        });

        const answer = completion.choices[0].message.content;

        // Save to MongoDB
        const newChat = new Chat({ question, answer });
        await newChat.save();

        res.json({ answer });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Failed to get answer from AI' });
    }
});

// Community Join Route
app.post('/api/members', async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const member = new Member({ name, email });
        await member.save();
        res.status(201).json({ message: 'Successfully joined the community!' });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error (email already exists)
            res.status(400).json({ error: 'This email is already registered. Try logging in! ✨' });
        } else {
            console.error('Join Error:', error);
            res.status(500).json({ error: 'Failed to join community' });
        }
    }
});

// Community Login Route
app.post('/api/members/login', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const member = await Member.findOne({ email });
        if (!member) {
            return res.status(404).json({ error: 'No member found with this email. Please join first! ✨' });
        }

        res.json({
            name: member.name,
            email: member.email,
            bio: member.bio || '',
            location: member.location || '',
            message: 'Welcome back!'
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Get User Profile
app.get('/api/members/:email', async (req, res) => {
    try {
        const member = await Member.findOne({ email: req.params.email });
        if (!member) return res.status(404).json({ error: 'User not found' });
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update User Profile
app.put('/api/members', async (req, res) => {
    try {
        const { email, name, bio, location } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const member = await Member.findOneAndUpdate(
            { email },
            { name, bio, location },
            { new: true, upsert: true }
        );

        if (!member) return res.status(404).json({ error: 'User not found' });
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get History
app.get('/api/history', async (req, res) => {
    try {
        const history = await Chat.find().sort({ timestamp: -1 }).limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Member Statistics
app.get('/api/members/count', async (req, res) => {
    try {
        const count = await Member.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch member count' });
    }
});

// Server Time
app.get('/api/time', (req, res) => {
    res.json({
        serverTime: new Date().toISOString(),
        timestamp: Date.now()
    });
});

// Community Chat Routes
app.get('/api/community/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

app.post('/api/community/messages', async (req, res) => {
    try {
        const { name, text } = req.body;
        if (!name || !text) {
            return res.status(400).json({ error: 'Name and message are required' });
        }
        const newMessage = new Message({ name, text });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Online Status Endpoints
app.post('/api/online/heartbeat', async (req, res) => {
    try {
        const identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        await ActiveSession.findOneAndUpdate(
            { identifier },
            { lastActive: new Date() },
            { upsert: true, new: true }
        );
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update heartbeat' });
    }
});

app.get('/api/online/count', async (req, res) => {
    try {
        // Cleanup old sessions (older than 2 minutes)
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
        await ActiveSession.deleteMany({ lastActive: { $lt: twoMinutesAgo } });

        const count = await ActiveSession.countDocuments();
        res.json({ count: Math.max(1, count) }); // Always show at least 1 (the current user)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch online count' });
    }
});

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve the frontend for any other route (Enables React Router/client-side routing)
app.get(/.*/, (req, res) => {
    try {
        const indexPath = path.join(__dirname, 'dist', 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            console.error('index.html not found at:', indexPath);
            res.status(404).send('Frontend build not found. Please ensure "npm run build" completed successfully.');
        }
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Internal Server Error while serving frontend');
    }
});

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
