from flask import Flask
from app.config import Config
from app.db import init_db
from app.routes import register_routes
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    init_db(app)
    register_routes(app)
    return app
