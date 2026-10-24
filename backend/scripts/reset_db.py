"""
scripts/reset_db.py — Utility script for ProofRent to reset or periodically clean the database.

Location: scripts/reset_db.py

Usage:
  1. One-shot wipe and re-initialize:
     python scripts/reset_db.py

  2. Continuous watch mode (clears DB every N seconds):
     python scripts/reset_db.py --watch --interval 5
"""

import argparse
import sqlite3
import time
from pathlib import Path


def get_db_path() -> Path:
    """Find proofrent.db regardless of whether script is run from root or scripts directory."""
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent

    candidates = [
        project_root / "backend" / "proofrent.db",
        project_root / "proofrent.db",
        script_dir / "backend" / "proofrent.db",
        script_dir / "proofrent.db",
        Path.cwd() / "backend" / "proofrent.db",
        Path.cwd() / "proofrent.db",
    ]
    for p in candidates:
        if p.exists():
            return p
    return project_root / "backend" / "proofrent.db"


def clear_database(db_path: Path) -> None:
    """Truncates reports and snapshots tables, resetting stored investigation results."""
    if not db_path.exists():
        print(f"[{time.strftime('%H:%M:%S')}] Database file not found at {db_path}. Nothing to clear.")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Count current records
        cursor.execute("SELECT COUNT(*) FROM reports")
        reports_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM snapshots")
        snapshots_count = cursor.fetchone()[0]

        # Truncate tables and commit DELETE transaction first
        cursor.execute("DELETE FROM reports")
        cursor.execute("DELETE FROM snapshots")
        conn.commit()

        # VACUUM requires autocommit mode outside active transactions
        conn.isolation_level = None
        cursor.execute("VACUUM")

        conn.close()

        print(f"[{time.strftime('%H:%M:%S')}] Successfully cleared {reports_count} reports and {snapshots_count} snapshots from {db_path.name}.")
    except sqlite3.OperationalError as e:
        print(f"[{time.strftime('%H:%M:%S')}] Database error: {e}")
    except Exception as e:
        print(f"[{time.strftime('%H:%M:%S')}] Error clearing database: {e}")


def main():
    parser = argparse.ArgumentParser(description="ProofRent Database Cleanup Utility")
    parser.add_argument("--watch", action="store_true", help="Keep running in watch mode to continuously clear DB")
    parser.add_argument("--interval", type=int, default=10, help="Interval in seconds for watch mode (default: 10s)")
    args = parser.parse_args()

    db_path = get_db_path()
    print(f"Target Database: {db_path}")

    if args.watch:
        print(f"Starting continuous cleanup watcher (interval: {args.interval}s). Press Ctrl+C to stop.")
        try:
            while True:
                clear_database(db_path)
                time.sleep(args.interval)
        except KeyboardInterrupt:
            print("\nDatabase watcher stopped.")
    else:
        clear_database(db_path)


if __name__ == "__main__":
    main()