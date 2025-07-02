async function fetchTweets() {
  const keyword = document.getElementById("keyword").value;
  const response = await fetch(`https://your-python-backend.herokuapp.com/search?q=${keyword}`);
  const tweets = await response.json();
  document.getElementById("results").innerHTML = JSON.stringify(tweets);
}
