import sqlite3

conn = sqlite3.connect("data/data.db")
conn.execute("""
CREATE TABLE IF NOT EXISTS cards (
    cardId INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
	caption TEXT NOT NULL,
    image TEXT,
    content TEXT
)
""")
conn.close()