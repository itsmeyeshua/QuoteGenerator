const CACHE_KEYS = {
    QUOTES: 'cached_quotes',
    TIMESTAMP: 'quotes_timestamp',
    CACHE_DURATION: 24 * 60 * 60 * 1000
};

function isCacheValid() {
    const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
    if (!timestamp) return false;
    
    const now = Date.now();
    return (now - parseInt(timestamp)) < CACHE_KEYS.CACHE_DURATION;
}

async function getQuotes() {
    if (isCacheValid()) {
        const cachedQuotes = localStorage.getItem(CACHE_KEYS.QUOTES);
        if (cachedQuotes) {
            console.log('Using cached quotes');
            return JSON.parse(cachedQuotes);
        }
    }
    
    try {
        const response = await fetch('http://localhost:5000/api/quotes'); // CHANGE
        if (!response.ok) {
            throw new Error('Failed to fetch quotes from API');
        }
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem(CACHE_KEYS.QUOTES, JSON.stringify(data.quotes));
            localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
            return data.quotes;
        } else {
            throw new Error('API returned unsuccessful response');
        }
    } catch (error) {
        console.error('Error fetching quotes from API:', error);
        
        const cachedQuotes = localStorage.getItem(CACHE_KEYS.QUOTES);
        if (cachedQuotes) {
            return JSON.parse(cachedQuotes);
        }
        
        throw error;
    }
}

async function displayRandomQuote() {
    const quoteElement = document.querySelector(".quote");
    const authorElement = document.querySelector(".author");
    const authorNameElement = document.querySelector(".author-name");
    const authorDesElement = document.querySelector(".acc-description");

    try {
        const quotes = await getQuotes();
        const randomNum = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomNum];

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
    displayRandomQuote();
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
    displayRandomQuote();
};