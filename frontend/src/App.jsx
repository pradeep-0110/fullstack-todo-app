import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const API_URL = "http://127.0.0.1:5000";

  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [filter, setFilter] = useState("all"); // 🔥 NEW

  // 🔹 Fetch todos
  const fetchTodos = () => {
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 🔹 Add
  const addTodo = async () => {
    if (!task.trim()) return;

    await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task }),
    });

    setTask("");
    fetchTodos();
  };

  // 🔹 Delete
  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
    });

    fetchTodos();
  };

  // 🔹 Toggle
  const toggleComplete = async (id, currentStatus) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !currentStatus,
      }),
    });

    fetchTodos();
  };

  // 🔹 Edit
  const startEdit = (id, currentTask) => {
    setEditingId(id);
    setEditText(currentTask);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    await fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: editText }),
    });

    setEditingId(null);
    setEditText("");
    fetchTodos();
  };

  // 🔥 FILTER LOGIC
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>📝 To-Do App</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* 🔥 FILTER BUTTONS */}
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>

        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-item">

            <div className="left">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  toggleComplete(todo.id, todo.completed)
                }
              />

              {editingId === todo.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span className={todo.completed ? "completed" : ""}>
                  {todo.task}
                </span>
              )}
            </div>

            <div className="right">
              {editingId === todo.id ? (
                <button onClick={() => saveEdit(todo.id)}>💾</button>
              ) : (
                <button onClick={() => startEdit(todo.id, todo.task)}>✏️</button>
              )}

              <button onClick={() => deleteTodo(todo.id)}>❌</button>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;