"""
Obsidian SOC Root Entry Point
Delegates execution to backend/start.py to guarantee zero-configuration
startup on Render, Railway, Heroku, Docker, and local development.
"""
import os
import sys

# Compute path to backend directory
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

try:
    os.chdir(BACKEND_DIR)
except Exception:
    pass

import start

if __name__ == "__main__":
    start.setup_environment()
    start.initialize_database()
    start.start_server()
