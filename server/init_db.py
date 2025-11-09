import sqlite3

conn = sqlite3.connect("data.db")
conn.execute("""
CREATE TABLE IF NOT EXISTS cards (
    cardId INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    caption TEXT,
    image TEXT,
    content TEXT
)
""")
conn.close()