import tweepy

def fetch_tweets(keyword):
    client = tweepy.Client(bearer_token='YOUR_BEARER_TOKEN')
    tweets = client.search_recent_tweets(query=keyword, max_results=10)
    for tweet in tweets.data:
        print(f"{tweet.text}\n---")

if __name__ == "__main__":
    keyword = input("Enter crypto keyword (e.g., Bitcoin): ")
    fetch_tweets(keyword)
