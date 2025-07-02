const API_URL = "https://x-monitor.onrender.com";
let currentPage = 1;
let currentKeyword = "";

// Main function to fetch tweets
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

// Pagination function
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
