from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
sys.path.insert(0, "/opt/render/project/src/backend") 
import tweepy
import os
from flask_cors import CORS  # Add this line
app = Flask(__name__)
CORS(app)  # Add this line


# Get token from Render environment variables
BEARER_TOKEN = os.environ.get('TWITTER_BEARER_TOKEN')

if not BEARER_TOKEN:
    raise RuntimeError("TWITTER_BEARER_TOKEN environment variable not set")

client = tweepy.Client(
    bearer_token=BEARER_TOKEN,
    wait_on_rate_limit=True
)

@app.route('/search')
def search():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400
    
    try:
        tweets = client.search_recent_tweets(
            query=query,
            max_results=10,
            tweet_fields=['public_metrics']
        )
        return jsonify([{
            "text": tweet.text,
            "likes": tweet.public_metrics['like_count'],
            "retweets": tweet.public_metrics['retweet_count']
        } for tweet in tweets.data])
    
    except tweepy.TweepyException as e:
        return jsonify({"error": str(e)}), 502

@app.route('/trends')
def get_trends():
    try:
        trends = client.get_place_trends(id=1)  # Worldwide trends
        return jsonify([{
            "name": trend['name'],
            "tweet_volume": trend.get('tweet_volume', 0)
        } for trend in trends[0]['trends'][:10]])
    
    except tweepy.TweepyException as e:
        return jsonify({"error": str(e)}), 502

@app.route('/trending-posts')
def get_trending_posts():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400
    
    try:
        tweets = client.search_recent_tweets(
            query=query,
            max_results=5,
            tweet_fields=['public_metrics'],
            sort_order='relevancy'
        )
        return jsonify([{
            "text": tweet.text,
            "likes": tweet.public_metrics['like_count']
        } for tweet in tweets.data])
    
    except tweepy.TweepyException as e:
        return jsonify({"error": str(e)}), 502

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
