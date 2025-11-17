const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'https://quote-generatorfront.vercel.app',
  ],
  credentials: true,
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

const MONGODB_URI = process.env.DATABASE_URL;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  console.log('Creating new database connection');

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  const connection = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    bufferMaxEntries: 0,
    maxPoolSize: 10,
  });

  cachedDb = connection;
  return connection;
}

const quoteSchema = new mongoose.Schema({
  quote: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true }
}, { 
  collection: 'quote',
  bufferCommands: false
});

const Quote = mongoose.model('Quote', quoteSchema);

app.get('/api/quotes', async (req, res) => {
  try {
    await connectToDatabase();
    const quotes = await Quote.find().maxTimeMS(30000);
    
    console.log(`📝 Found ${quotes.length} quotes`);
    
    res.json({
      success: true,
      quotes: quotes
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection error'
    });
  }
});


if (process.env.VERCEL) {
  module.exports = app;
}