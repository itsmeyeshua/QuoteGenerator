const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://quote-generatorfront.vercel.app/',
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.DATABASE_URL;

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
});

const quoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { collection: 'quote' });

const Quote = mongoose.model('Quote', quoteSchema);

// ROUTES
app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json({
      success: true,
      quotes: quotes
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quotes from database'
    });
  }
});

app.get('/api/quotes/random', async (req, res) => {
  try {
    const count = await Quote.countDocuments();
    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: 'No quotes found in database'
      });
    }
    
    const random = Math.floor(Math.random() * count);
    const randomQuote = await Quote.findOne().skip(random);
    
    res.json({
      success: true,
      quote: randomQuote
    });
  } catch (error) {
    console.error('Error fetching random quote:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching random quote'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});