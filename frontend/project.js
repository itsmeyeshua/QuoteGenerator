const CACHE_KEYS = {
    QUOTES: 'cached_quotes',
    TIMESTAMP: 'quotes_timestamp',
    CACHE_DURATION: 24 * 60 * 60 * 1000
};

const queryParams = new URLSearchParams(window.location.search);
const FORCE_REFRESH = queryParams.get('forceRefresh') === 'true';

function isCacheValid() {
    const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
    if (!timestamp) return false;
    
    const now = Date.now();
    return (now - parseInt(timestamp)) < CACHE_KEYS.CACHE_DURATION;
}

async function getQuotes({ forceRefresh = false } = {}) {
    if (!forceRefresh && isCacheValid()) {
        const cachedQuotes = localStorage.getItem(CACHE_KEYS.QUOTES);
        if (cachedQuotes) {
            console.log('Using cached quotes');
            return JSON.parse(cachedQuotes);
        }
    }
    
    try {
        // const apiUrl = new URL('https://quote-generator-backend-theta.vercel.app/api/quotes');
        const apiUrl = new URL('http://127.0.0.1:5000/api/quotes');
        if (forceRefresh) {
            apiUrl.searchParams.set('forceRefresh', 'true');
            apiUrl.searchParams.set('t', Date.now().toString());
        }

        const response = await fetch(apiUrl.toString(), {
            cache: forceRefresh ? 'no-store' : 'default'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch quotes from API');
        }
        
        const data = await response.json();
        
        let quotes;

        if (Array.isArray(data)) {
            quotes = data;
        } else if (data.success && Array.isArray(data.quotes)) {
            quotes = data.quotes;
        } else {
            throw new Error('Invalid API response format');
        }

        if (quotes && quotes.length > 0) {
            localStorage.setItem(CACHE_KEYS.QUOTES, JSON.stringify(quotes));
            localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
        } else {
            localStorage.removeItem(CACHE_KEYS.QUOTES);
            localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
        }

        return quotes;
    } catch (error) {
        console.error('Error fetching quotes from API:', error);
        
        const cachedQuotes = localStorage.getItem(CACHE_KEYS.QUOTES);
        if (cachedQuotes) {
            return JSON.parse(cachedQuotes);
        }
        
        throw error;
    }
}

async function displayRandomQuote(options = {}) {
    const quoteElement = document.querySelector(".quote");
    const authorElement = document.querySelector(".author");
    const authorNameElement = document.querySelector(".author-name");
    const authorDesElement = document.querySelector(".acc-description");

    try {
        const quotes = await getQuotes(options);
        if (!quotes || quotes.length === 0) {
            throw new Error('No quotes available');
        }

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        if (!randomQuote) {
            throw new Error('Random quote is undefined');
        }

        authorElement.textContent = randomQuote.author;
        authorNameElement.textContent = randomQuote.author;
        quoteElement.textContent = randomQuote.quote;
        authorDesElement.textContent = randomQuote.description;
    } catch (error) {
        console.error("Error displaying quote:", error);
        quoteElement.textContent = "Unable to load quotes. Please check your connection.";
        authorElement.textContent = "System";
        authorNameElement.textContent = "System";
        authorDesElement.textContent = "Quote service unavailable";
    }
}

window.addEventListener("load", function() {
    displayRandomQuote({ forceRefresh: FORCE_REFRESH });
}, { once: true });

document.getElementById('quote-gen').addEventListener("click", function() {
    displayRandomQuote();
    
    const authDesContainer = document.querySelector(".acc-author");
    const accDesc = document.querySelector(".acc-description");
    if (authDesContainer.classList.contains("acc-author-active")) {
        authDesContainer.classList.remove("acc-author-active");
        accDesc.classList.remove("acc-description-active");
    }
});

document.querySelector(".acc-author").addEventListener("click", function() {
    const authDesContainer = document.querySelector(".acc-author");
    const accDesc = document.querySelector(".acc-description");

    authDesContainer.classList.toggle("acc-author-active");
    accDesc.classList.toggle("acc-description-active");
});

const knockButton = document.querySelector("#knock");
const closeButton = document.querySelector("#close-button");
const hereiamDiv = document.querySelector(".hereiam");

knockButton.addEventListener("click", function () {
    hereiamDiv.classList.toggle("hereiam-active");
});

closeButton.addEventListener("click", function () {
    hereiamDiv.classList.remove("hereiam-active");
});

window.refreshQuotesCache = function() {
    localStorage.removeItem(CACHE_KEYS.QUOTES);
    localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
    displayRandomQuote({ forceRefresh: true });
};