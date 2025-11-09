from flask import Flask, jsonify, request, g, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Add upload configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect("data.db")
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
        caption = request.form["caption"]
        content = request.form["content"]
        image_file = request.files["image"]
        
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
        data = request.get_json()
        if not data or 'cardId' not in data:
            return jsonify({"error": "cardId required"}), 400
        db.execute(
            "UPDATE cards SET title = ?, caption = ?, image = ?, content = ? WHERE cardId = ?",
            (data["title"], data["caption"], data["image"], data["content"], data["cardId"])
        )
        db.commit()
        return jsonify({"status": "updated"}), 200

if __name__ == "__main__":
    app.run(debug=True)