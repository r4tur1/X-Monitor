const API_URL = "https://x-monitor.onrender.com";
let currentPage = 1;
let currentKeyword = "";

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
    currentPage--;
  } finally {
    showLoading(false);
  }
}

// Unified display function with animations
function displayTweets(tweets) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = '';
  
  tweets.forEach((tweet, index) => {
    const tweetElement = document.createElement('div');
    tweetElement.className = 'tweet tweet-enter';
    tweetElement.style.animationDelay = `${index * 0.1}s`;
    tweetElement.innerHTML = `
      <p>${tweet.text}</p>
      <small>❤️ ${tweet.public_metrics?.like_count || 0} likes</small>
    `;
    resultsDiv.appendChild(tweetElement);
  });
}

function appendTweets(tweets) {
  const resultsDiv = document.getElementById("results");
  tweets.forEach((tweet, index) => {
    const tweetElement = document.createElement('div');
    tweetElement.className = 'tweet tweet-enter';
    tweetElement.style.animationDelay = `${index * 0.1}s`;
    tweetElement.innerHTML = `
      <p>${tweet.text}</p>
      <small>❤️ ${tweet.public_metrics?.like_count || 0} likes</small>
    `;
    resultsDiv.appendChild(tweetElement);
  });
}

function showLoading(show) {
  document.getElementById("loading").style.display = show ? "block" : "none";
}

// Trending and keyboard support
function searchTrending(term) {
  const searchBar = document.getElementById('keyword');
  searchBar.value = term;
  searchBar.classList.add('search-bar-active');
  fetchTweets();
}

document.getElementById('keyword').addEventListener('keypress', (e) => {
  if(e.key === 'Enter') fetchTweets();
});
