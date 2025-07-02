from flask import Flask, request, jsonify
import tweepy
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

client = tweepy.Client(bearer_token=os.getenv("TWITTER_BEARER_TOKEN"))

@app.route('/search')
def search():
    try:
        tweets = client.search_recent_tweets(
            query=request.args.get('q'),
            max_results=10,
            tweet_fields=['public_metrics']
        )
        return jsonify([{
            'text': tweet.text,
            'likes': tweet.public_metrics['like_count']
        } for tweet in tweets.data])
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run()
