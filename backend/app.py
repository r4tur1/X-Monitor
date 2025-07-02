from flask import Flask, request, jsonify
import tweepy
import os
from dotenv import load_dotenv

# Initialize Flask
app = Flask(__name__)

# Load environment variables
load_dotenv()  # Only for local development

# Get Twitter token - priority order:
# 1. Render environment variable (production)
# 2. .env file (development)
# 3. Explicit error if missing
bearer_token = os.environ.get('TWITTER_BEARER_TOKEN')
if not bearer_token:
    raise ValueError("Missing TWITTER_BEARER_TOKEN in environment variables")

client = tweepy.Client(bearer_token=bearer_token)

@app.route('/search')
def search():
    try:
        query = request.args.get('q')
        if not query or len(query.strip()) < 2:
            return jsonify({'error': 'Query too short'}), 400
            
        tweets = client.search_recent_tweets(
            query=query,
            max_results=10,
            tweet_fields=['public_metrics']
        )
        return jsonify([{
            'text': tweet.text,
            'likes': tweet.public_metrics['like_count'],
            'id': tweet.id
        } for tweet in tweets.data])
        
    except tweepy.TweepyException as e:
        return jsonify({'error': f"Twitter API error: {str(e)}"}), 502
    except Exception as e:
        return jsonify({'error': f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
