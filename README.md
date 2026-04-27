# Random Quote Generator
A full-stack web application that displays random inspirational quotes, built with pure vanilla JavaScript on the frontend for optimal performance and modern backend technologies.
[Live Demo](https://quote-generatorfront.vercel.app)

## Features
* Random inspirational quotes

* Author information with toggle

* Fully responsive design

* Fast loading with caching

## Tech Stack
```
Frontend: HTML5, CSS3, Vanilla JavaScript
Backend: Node.js, Express, MongoDB Atlas
Hosting: Vercel (Frontend & Backend)
```
## Project Structure
```bash
quote-generator/
├── frontend/          # Static files (Vercel)
├── backend/           # Express API (Vercel)  
└── database/          # MongoDB Atlas
```

## Development

### Frontend Development
```bash
# Clone the repository
git clone <your-repo-url>
cd frontend


# Open in browser
open index.html
```

### Backend Development
```bash
cd backend

# Install dependencies
npm install

# Set environment variables
echo "DATABASE_URL=your_mongodb_connection_string" > .env
echo "PORT=5000" >> .env

# Start development server
npm run dev
```

### Database Schema
```javascript
{
  quote: String,        // The inspirational quote text
  author: String,       // Author's name
  description: String   // Author background/description
}
```

## Features in Detail
### Frontend Features
- Local Storage Caching - Quotes cached for 24 hours

- Error Handling - Graceful fallbacks for API failures

- Accessibility - Proper ARIA labels and keyboard navigation

- Performance - Optimized animations and efficient DOM updates

### Backend Features
- RESTful API - Clean, predictable endpoints

- CORS Configuration - Secure cross-origin requests

- Error Handling - Comprehensive error responses

- MongoDB Optimization - Connection pooling and timeouts

## API Endpoints
GET /api/quotes - Get all quotes

GET /api/quotes/random - Get random quote

## Force Refresh (Bypass Cache)
Use this when a bot or user must fetch fresh data and skip aggressive caching.

### Frontend Route
Open the app with:

```text
/?forceRefresh=true
```

Behavior:
- Skips localStorage quote cache on initial load
- Forces a fresh request to the backend
- Adds a timestamp query value to avoid intermediary cache reuse

Example:

```text
https://quote-generatorfront.vercel.app/?forceRefresh=true
```

### API Request
You can also call the API with:

```text
/api/quotes?forceRefresh=true
```

Behavior:
- Backend sends no-cache headers (`Cache-Control`, `Pragma`, `Expires`, `Surrogate-Control`)
- Helps ensure proxies/CDNs do not return stale cached responses
