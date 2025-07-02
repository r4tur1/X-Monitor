let currentPage = 1;

async function fetchTweets() {
  const keyword = document.getElementById("keyword").value;
  const response = await fetch(`https://your-backend-api.herokuapp.com/search?q=${keyword}&page=${currentPage}`);
  const tweets = await response.json();
  
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = tweets.map(tweet => `
    <div class="tweet">
      <p>${tweet.text}</p>
      <small>Likes: ${tweet.public_metrics?.like_count || 0}</small>
    </div>
  `).join("");

  currentPage = 1; // Reset on new search
}

async function loadMore() {
  currentPage++;
  const keyword = document.getElementById("keyword").value;
  const response = await fetch(`https://your-backend-api.herokuapp.com/search?q=${keyword}&page=${currentPage}`);
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
