
const API_URL = "https://"; // CHANGE THIS
let currentPage = 1;
let currentKeyword = "";

// Updated fetchTweets function
async function fetchTweets() {
  currentKeyword = document.getElementById("keyword").value.trim();
  if (!currentKeyword) return;
  
  currentPage = 1;
  showLoading(true);
  
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(currentKeyword)}&page=${currentPage}`);
    if (!response.ok) throw new Error("API request failed");
    const tweets = await response.json();
    displayTweets(tweets);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to fetch tweets. Check console for details.");
  } finally {
    showLoading(false);
  }
}

// New loadMore function
async function loadMore() {
  if (!currentKeyword) return;
  
  showLoading(true);
  currentPage++;
  
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(currentKeyword)}&page=${currentPage}`);
    const tweets = await response.json();
    appendTweets(tweets);
  } catch (error) {
    console.error("Error:", error);
    currentPage--; // Revert page increment on failure
  } finally {
    showLoading(false);
  }
}

// Helper functions
function showLoading(show) {
  document.getElementById("loading").style.display = show ? "block" : "none";
}

function displayTweets(tweets) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = tweets.map(formatTweet).join("");
}

function appendTweets(tweets) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML += tweets.map(formatTweet).join("");
}
function formatTweet(tweet) {
  return `
    <div class="tweet">
      <p>${tweet.text}</p>
      <small>Likes: ${tweet.public_metrics?.like_count || 0}</small>
    </div>
  `;
}
let currentPage = 1;

async function fetchTweets() {
  const keyword = document.getElementById("keyword").value;
  // Replace with your actual API endpoint
  const response = await fetch(`YOUR_BACKEND_API/search?q=${keyword}&page=${currentPage}`);
  const tweets = await response.json();
  displayTweets(tweets);
}

function displayTweets(tweets) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = tweets.map(tweet => `
    <div class="tweet">
      <p>${tweet.text}</p>
      <small>Likes: ${tweet.public_metrics?.like_count || 0}</small>
    </div>
  `).join("");
}

async function loadMore() {
  currentPage++;
  const keyword = document.getElementById("keyword").value;
  const response = await fetch(`YOUR_BACKEND_API/search?q=${keyword}&page=${currentPage}`);
  const tweets = await response.json();
  
  const resultsDiv = document.getElementById("results");
  tweets.forEach(tweet => {
    resultsDiv.innerHTML += `
      <div class="tweet">
        <p>${tweet.text}</p>
        <small>Likes: ${tweet.public_metrics?.like_count || 0}</small>
      </div>
    `;
  });
}
