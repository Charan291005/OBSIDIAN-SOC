from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
default_sqlite_path = os.path.join(backend_dir, "obsidian_soc.db")
default_sqlite_url = f"sqlite:///{default_sqlite_path.replace(os.sep, '/')}"

# Database URL from settings or environment
raw_url = os.environ.get("DATABASE_URL") or settings.DATABASE_URL or default_sqlite_url

if raw_url.startswith("postgres://"):
    raw_url = raw_url.replace("postgres://", "postgresql://", 1)

def initialize_engine(url: str):
    if url.startswith("sqlite"):
        return url, create_engine(url, connect_args={"check_same_thread": False})
    
    try:
        # Test connection proactively with a 4-second timeout to handle dead/expired cloud DBs
        test_engine = create_engine(
            url,
            pool_pre_ping=True,
            pool_recycle=300,
            connect_args={"connect_timeout": 4}
        )
        with test_engine.connect() as conn:
            from sqlalchemy import text
            conn.execute(text("SELECT 1"))
        print("[Database] Successfully connected to PostgreSQL database.")
        return url, test_engine
    except Exception as exc:
        print(f"[Database Warning] Failed to connect to PostgreSQL ({exc}). Gracefully falling back to SQLite.")
        return default_sqlite_url, create_engine(default_sqlite_url, connect_args={"check_same_thread": False})

DB_URL, engine = initialize_engine(raw_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
