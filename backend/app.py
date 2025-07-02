from flask import Flask, request, jsonify
from flask_cors import CORS
import tweepy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Twitter API Client
client = tweepy.Client(
    bearer_token=os.getenv("TWITTER_BEARER_TOKEN"),
    wait_on_rate_limit=True
)

@app.route('/search', methods=['GET'])
def search():
    try:
        query = request.args.get('q')
        page = int(request.args.get('page', 1))
        
        if not query or len(query.strip()) < 2:
            return jsonify({"error": "Query too short"}), 400

        tweets = client.search_recent_tweets(
            query=query,
            max_results=10,
            tweet_fields=['public_metrics', 'created_at'],
            expansions=['author_id'],
            user_fields=['username', 'profile_image_url'],
            page=page
        )
        
        # Format response
        result = []
        for tweet in tweets.data:
            author = next(u for u in tweets.includes['users'] if u.id == tweet.author_id)
            result.append({
                "id": tweet.id,
                "text": tweet.text,
                "created_at": tweet.created_at.isoformat(),
                "author": author.username,
                "author_image": author.profile_image_url,
                "likes": tweet.public_metrics['like_count'],
                "retweets": tweet.public_metrics['retweet_count'],
                "replies": tweet.public_metrics['reply_count']
            })
        
        return jsonify(result)
    
    except tweepy.TweepyException as e:
        return jsonify({"error": str(e)}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/trends', methods=['GET'])
def get_trends():
    try:
        # Get worldwide trends (WOEID = 1)
        trends = client.get_place_trends(id=1)
        return jsonify([{
            "name": trend['name'],
            "url": trend['url'],
            "tweet_volume": trend.get('tweet_volume')
        } for trend in trends[0]['trends'][:10]])
    
    except tweepy.TweepyException as e:
        return jsonify({"error": str(e)}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/trending-posts', methods=['GET'])
def get_trending_posts():
    try:
        query = request.args.get('q')
        if not query:
            return jsonify({"error": "Missing query parameter"}), 400
        
        tweets = client.search_recent_tweets(
            query=query,
            max_results=10,
            tweet_fields=['public_metrics'],
            sort_order='relevancy'
        )
        
        return jsonify([{
            "text": tweet.text,
            "likes": tweet.public_metrics['like_count'],
            "retweets": tweet.public_metrics['retweet_count'],
            "replies": tweet.public_metrics['reply_count']
        } for tweet in tweets.data])
    
    except tweepy.TweepyException as e:
        return jsonify({"error": str(e)}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
