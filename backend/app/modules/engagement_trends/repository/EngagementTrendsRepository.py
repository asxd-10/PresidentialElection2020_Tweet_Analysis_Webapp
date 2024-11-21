from app.db import db
from app.models import Tweet
from sqlalchemy import func, desc, cast, Date
from decimal import Decimal

class EngagementTrendsRepository:
    def __init__(self):
        pass

    # This method is used to get the days where the engagement is higher than the average engagement by a certain threshold for a given candidate
    # The engagement is calculated by adding the number of likes and retweets for each tweet
    @staticmethod
    def get_engagement_spike_days(candidate, threshold=1.5):
        daily_engagement = (
            db.session.query(
                cast(Tweet.created_at, Date).label('date'),
                func.sum(Tweet.likes + Tweet.retweet_count).label('engagement')
            )
            .filter(Tweet.tweet_about == candidate)
            .group_by(cast(Tweet.created_at, Date))
            .subquery()
        )

        average_engagement = db.session.query(
            func.avg(daily_engagement.c.engagement).label('average')
        ).scalar()

        spikes = (
            db.session.query(daily_engagement.c.date, daily_engagement.c.engagement)
            .filter(daily_engagement.c.engagement > average_engagement * Decimal(threshold))
            .order_by(daily_engagement.c.date)
            .all()
        )

        return spikes

    @staticmethod
    def get_daily_engagement(candidate):
        return (
            db.session.query(
                cast(Tweet.created_at, Date).label("date"),
                func.sum(Tweet.likes + Tweet.retweet_count).label("engagement")
            )
            .filter(Tweet.tweet_about == candidate)
            .group_by(cast(Tweet.created_at, Date))
            .order_by(cast(Tweet.created_at, Date))
            .all()
        )


    @staticmethod
    def get_high_volume_days(candidate, limit=5):
        res = (
            db.session.query(
                cast(Tweet.created_at, Date).label('date'),
                func.sum(Tweet.likes + Tweet.retweet_count).label('engagement')
            )
            .filter(Tweet.tweet_about == candidate)
            .group_by(cast(Tweet.created_at, Date))
            .order_by(desc('engagement'))
            .limit(limit)
            .all()
        )
        return res