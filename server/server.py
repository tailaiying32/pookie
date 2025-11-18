from flask import Flask, jsonify, request, g, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
from werkzeug.utils import secure_filename

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

# DB path under data/
SQLITE_PATH = os.environ.get(
    "SQLITE_PATH",
    os.path.join(DATA_DIR, "data.db")
)

app = Flask(__name__)
CORS(app)

# Upload config under data/uploads
UPLOAD_FOLDER = os.path.join(DATA_DIR, "uploads")
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ISO_DATE_FORMAT = "%Y-%m-%d"



def normalize_caption_date(value):
    """Validate incoming date strings and normalize to ISO format."""
    if value is None:
        return None

    stripped = value.strip()
    if not stripped:
        return None

    try:
        parsed = datetime.strptime(stripped, ISO_DATE_FORMAT)
    except ValueError:
        return None

    return parsed.date().isoformat()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(SQLITE_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(error):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/cards", methods=["GET", "POST", "DELETE", "PUT"])
def cards():
    db = get_db()

    if request.method == "GET":
        cards = db.execute("SELECT * FROM cards").fetchall()
        return jsonify([dict(card) for card in cards])
    
    elif request.method == "POST":
        # Check if all required fields are present
        if 'title' not in request.form or 'caption' not in request.form or 'content' not in request.form:
            return jsonify({"error": "Missing required fields"}), 400
        
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        title = request.form["title"]
        raw_caption = request.form["caption"]
        caption = normalize_caption_date(raw_caption)
        content = request.form["content"]
        image_file = request.files["image"]

        if caption is None:
            return jsonify({"error": "Invalid date format. Please use YYYY-MM-DD."}), 400
        
        # Check if file is valid
        if image_file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            # Add timestamp to avoid filename conflicts
            import time
            filename = f"{int(time.time())}_{filename}"
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(image_path)
            
            # Store relative path in database
            db_image_path = f"uploads/{filename}"
            
            cursor = db.cursor()
            cursor.execute(
                "INSERT INTO cards (title, caption, image, content) VALUES (?, ?, ?, ?)",
                (title, caption, db_image_path, content)
            )
            card_id = cursor.lastrowid
            db.commit()
            return jsonify({"status": "ok", "cardId": card_id}), 201
        else:
            return jsonify({"error": "Invalid file type"}), 400

    elif request.method == "DELETE":
        data = request.get_json()
        if not data or 'cardId' not in data:
            return jsonify({"error": "cardId required"}), 400
        # Get the image path before deleting the card
        cur = db.execute("SELECT image FROM cards WHERE cardId = ?", (data["cardId"],))
        row = cur.fetchone()
        if row and row["image"]:
            image_path = row["image"]
            # Only try to delete if the file exists
            if os.path.exists(image_path):
                os.remove(image_path)
        db.execute("DELETE FROM cards WHERE cardId = ?", (data["cardId"],))
        db.commit()
        return jsonify({"status": "deleted"}), 200

    elif request.method == "PUT":
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            form = request.form
            card_id = form.get('cardId')

            if not card_id:
                return jsonify({"error": "cardId required"}), 400

            try:
                card_id_int = int(card_id)
            except (TypeError, ValueError):
                return jsonify({"error": "Invalid cardId"}), 400

            title = form.get('title')
            raw_caption = form.get('caption')
            content = form.get('content')

            if not title or not raw_caption or not content:
                return jsonify({"error": "Missing required fields"}), 400

            caption = normalize_caption_date(raw_caption)
            if caption is None:
                return jsonify({"error": "Invalid date format. Please use YYYY-MM-DD."}), 400

            current = db.execute(
                "SELECT image FROM cards WHERE cardId = ?",
                (card_id_int,)
            ).fetchone()

            if current is None:
                return jsonify({"error": "Card not found"}), 404

            image_path = current["image"]
            image_file = request.files.get('image')

            if image_file and image_file.filename:
                if not allowed_file(image_file.filename):
                    return jsonify({"error": "Invalid file type"}), 400

                filename = secure_filename(image_file.filename)
                import time
                filename = f"{int(time.time())}_{filename}"
                upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                image_file.save(upload_path)
                new_image_path = f"uploads/{filename}"

                if image_path and os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(image_path))):
                    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(image_path)))

                image_path = new_image_path

            db.execute(
                "UPDATE cards SET title = ?, caption = ?, image = ?, content = ? WHERE cardId = ?",
                (title, caption, image_path, content, card_id_int)
            )
            db.commit()
            return jsonify({"status": "updated"}), 200
        else:
            data = request.get_json()
            if not data or 'cardId' not in data:
                return jsonify({"error": "cardId required"}), 400

            title = data.get("title")
            raw_caption = data.get("caption")
            content = data.get("content")

            if not title or not raw_caption or not content:
                return jsonify({"error": "Missing required fields"}), 400

            caption = normalize_caption_date(raw_caption)
            if caption is None:
                return jsonify({"error": "Invalid date format. Please use YYYY-MM-DD."}), 400

            card_id = data["cardId"]

            try:
                card_id_int = int(card_id)
            except (TypeError, ValueError):
                return jsonify({"error": "Invalid cardId"}), 400

            image_path = data.get("image")

            if image_path is None:
                current = db.execute(
                    "SELECT image FROM cards WHERE cardId = ?",
                    (card_id_int,)
                ).fetchone()
                image_path = current["image"] if current else None

            db.execute(
                "UPDATE cards SET title = ?, caption = ?, image = ?, content = ? WHERE cardId = ?",
                (title, caption, image_path, content, card_id_int)
            )
            db.commit()
            return jsonify({"status": "updated"}), 200

if __name__ == "__main__":
    app.run(debug=True)