window.addEventListener("load", function() {
    let randomeNum = Math.floor(Math.random() * 105);
    let quote = document.querySelector(".quote");
    let author = document.querySelector(".author");
    let authorName = document.querySelector(".author-name");
    let authorDes = document.querySelector(".acc-description");

    fetch('quotes.json')
    .then(res => {
        if(!res.ok)
            throw new console.error("failed fetching from file");
        return (res.json());
    })
    .then(data => {
        let randomeNum = Math.floor(Math.random() * data.quotes.length);
        author.innerText = data.quotes[randomeNum].author;
        authorName.innerText = data.quotes[randomeNum].author;
        quote.innerText = data.quotes[randomeNum].quote;
        authorDes.innerText = data.quotes[randomeNum].description;
    })
    .catch(err => {
        console.error("fetching failed", err);
    })
}, {once : true})


document.getElementById('quote-gen').addEventListener("click", function() {
    let quote = document.querySelector(".quote");
    let author = document.querySelector(".author");
    let authorName = document.querySelector(".author-name");
    let authorDes = document.querySelector(".acc-description");
    
    fetch('quotes.json')
    .then(res => {
        if(!res.ok)
            throw new console.error("failed fetching from file");
        return (res.json());
    })
    .then(data => {
            let randomeNum = Math.floor(Math.random() * data.quotes.length);
            author.innerText = data.quotes[randomeNum].author;
            authorName.innerText = data.quotes[randomeNum].author;
            quote.innerText = data.quotes[randomeNum].quote;
            authorDes.innerText = data.quotes[randomeNum].description;

            let authDesContainer = document.querySelector(".acc-author");
            let accDesc = document.querySelector(".acc-description");
            if (authDesContainer.classList.contains("acc-author-active")) {
                authDesContainer.classList.remove("acc-author-active")
                accDesc.classList.remove("acc-description-active");
            }
    })
    .catch(err => {
        console.error(err);
    })
})

document.querySelector(".acc-author").addEventListener("click", function() {
    let authDesContainer = document.querySelector(".acc-author");
    let accDesc = document.querySelector(".acc-description");

    authDesContainer.classList.toggle("acc-author-active");
    accDesc.classList.toggle("acc-description-active");

})

const knockButton = document.querySelector("#knock");
const closeButton = document.querySelector("#close-button");
const hereiamDiv = document.querySelector(".hereiam");

knockButton.addEventListener("click", function () {
    hereiamDiv.classList.toggle("hereiam-active");
});

closeButton.addEventListener("click", function () {
    hereiamDiv.classList.remove("hereiam-active");
});