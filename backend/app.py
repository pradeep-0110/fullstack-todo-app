from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)


# 🔹 Database connection
def get_db_connection():
    conn = sqlite3.connect("todos.db")
    conn.row_factory = sqlite3.Row
    return conn


# 🔹 Initialize database
def init_db():
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            completed BOOLEAN NOT NULL
        )
    """
    )
    conn.commit()
    conn.close()


init_db()


# 🔹 GET all todos
@app.route("/todos", methods=["GET"])
def get_todos():
    conn = get_db_connection()
    todos = conn.execute("SELECT * FROM todos").fetchall()
    conn.close()

    return jsonify([dict(todo) for todo in todos])


# 🔹 ADD new todo
@app.route("/todos", methods=["POST"])
def add_todo():
    data = request.json

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO todos (task, completed) VALUES (?, ?)", (data["task"], False)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Todo added"}), 201


# 🔹 UPDATE todo (edit + checkbox)
@app.route("/todos/<int:id>", methods=["PUT"])
def update_todo(id):
    data = request.json

    conn = get_db_connection()

    if "task" in data:
        conn.execute("UPDATE todos SET task = ? WHERE id = ?", (data["task"], id))

    if "completed" in data:
        conn.execute(
            "UPDATE todos SET completed = ? WHERE id = ?", (data["completed"], id)
        )

    conn.commit()
    conn.close()

    return jsonify({"message": "Updated"})


# 🔹 DELETE todo
@app.route("/todos/<int:id>", methods=["DELETE"])
def delete_todo(id):
    conn = get_db_connection()
    conn.execute("DELETE FROM todos WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted"})


# 🔹 Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
