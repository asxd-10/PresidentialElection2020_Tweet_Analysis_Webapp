from flask import Blueprint
from app.modules.homepage.controller.homepageController import HomepageController

homepage_bp = Blueprint('homepage', __name__)

homepage_bp.route('/overview', methods=['GET'])(HomepageController.get_total_tweets_overview)
homepage_bp.route('/trending-candidates', methods=['GET'])(HomepageController.get_trending_candidates)
homepage_bp.route('/most-active-users', methods=['GET'])(HomepageController.get_most_active_users)