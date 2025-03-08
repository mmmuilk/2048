from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

def init_db():
    conn = sqlite3.connect("scores.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            score INTEGER NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.json
    name = data.get("name", "Player")  # 默认名称 Player
    score = data.get("score", 0)

    conn = sqlite3.connect("scores.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO scores (name, score) VALUES (?, ?)", (name, score))
    conn.commit()
    conn.close()

    return jsonify({"message": "Score submitted successfully"}), 200

@app.route('/get_top_scores', methods=['GET'])
def get_top_scores():
    conn = sqlite3.connect("scores.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name, score FROM scores ORDER BY score DESC LIMIT 3")
    top_scores = cursor.fetchall()
    conn.close()

    return jsonify({"top_scores": top_scores}), 200

if __name__ == '__main__':
    import os
    pot=int(os.environ.get("PORT",5000))
    app.run(host="0.0.0.0", port=port, debug=True)
