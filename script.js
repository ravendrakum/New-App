// API key and base URL for the News API
const API_KEY = "db7d92037786484a902fd93d4a8cd0af";
const url = "https://newsapi.org/v2/everything?q=";

// Event listener for when the window loads, fetching news for India
window.addEventListener("load", () => {
    fetchNews("India")
        .then(() => {
            // Do something after fetching news (if needed)
        })
        .catch((error) => {
            console.error("Error loading news on window load:", error);
        });
});

// Function to reload the window
function reload() {
    window.location.reload();
}

// Function to fetch news based on a query
function fetchNews(query) {
    // Fetching news data from the API
    return fetch(`${url}${query}&apiKey=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            // Binding the fetched data to the UI
            bindData(data.articles);
        })
        .catch((error) => {
            console.error("Error fetching news:", error);
        });
}

// Function to bind news data to the UI
function bindData(articles) {
    // Getting the container and template for news cards
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clearing existing content in the container
    cardsContainer.innerHTML = "";

    // Looping through each article and creating a card for it
    articles.forEach((article) => {
        // Skipping articles without an image
        if (!article.urlToImage) return;

        // Cloning the template and filling it with data
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);

        // Appending the card to the container
        cardsContainer.appendChild(cardClone);
    });
}

// Function to fill data into a news card template
function fillDataInCard(cardClone, article) {
    // Getting elements in the card
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    // Filling data into the elements
    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    // Formatting and filling the date and source information
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Adding a click event to open the article in a new tab
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Variable to keep track of the currently selected navigation item
let curSelectedNav = null;

// Function to handle navigation item clicks
function onNavItemClick(id) {
    // Fetching news based on the clicked navigation item
    fetchNews(id)
        .then(() => {
            // Updating the active state of the navigation items
            const navItem = document.getElementById(id);
            curSelectedNav?.classList.remove("active");
            curSelectedNav = navItem;
            curSelectedNav.classList.add("active");
        })
        .catch((error) => {
            console.error("Error handling navigation item click:", error);
        });
}

// Getting search button and text input elements
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

// Event listener for the search button click
searchButton.addEventListener("click", () => {
    // Getting the search query from the input field
    const query = searchText.value;

    // Checking if the query is not empty
    if (!query) return;

    // Fetching news based on the search query
    fetchNews(query)
        .then(() => {
            // Clearing the active state of navigation items
            curSelectedNav?.classList.remove("active");
            curSelectedNav = null;
        })
        .catch((error) => {
            console.error("Error handling search button click:", error);
        });
});
