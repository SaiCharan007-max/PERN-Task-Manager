import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";

export default function Dashboard() {
  const { token, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState("todo");

  /* =========================
     THEME TOGGLE
  ========================= */
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  /* =========================
     FETCH TASKS
  ========================= */
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* =========================
     CREATE / UPDATE TASK
  ========================= */
  const saveTask = async () => {
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      priority,
      status,
    };

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.task_id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/tasks", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetModal();
      fetchTasks();
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  const resetModal = () => {
    setTitle("");
    setDescription("");
    setPriority(1);
    setStatus("todo");
    setEditingTask(null);
    setShowModal(false);
  };

  /* =========================
     DELETE TASK
  ========================= */
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  /* =========================
     TOGGLE DONE
  ========================= */
  const toggleDone = async (task) => {
    try {
      await api.put(
        `/tasks/${task.task_id}`,
        {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status === "done" ? "todo" : "done",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  /* =========================
     STATS
  ========================= */
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const pending = total - completed;

  /* =========================
     DATE HELPERS (ADDED)
  ========================= */
  const today = new Date().setHours(0, 0, 0, 0);

  return (
    <>
      {/* NAVBAR */}
      <div className="dashboard-nav">
        <h2>Task Manager</h2>

        <div className="nav-actions">
          <button className="icon-btn" onClick={toggleTheme}>
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          <button className="primary-btn" onClick={() => setShowModal(true)}>
            + New Task
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">
        {/* HERO */}
        <div className="dashboard-hero">
          <h1>Your Tasks</h1>
          <p>Stay organized & focused</p>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{total}</h3>
            <span>Total Tasks</span>
          </div>
          <div className="stat-card">
            <h3>{completed}</h3>
            <span>Completed</span>
          </div>
          <div className="stat-card">
            <h3>{pending}</h3>
            <span>Pending</span>
          </div>
        </div>

        {/* TASK LIST */}
        {tasks.length === 0 ? (
          <div className="empty-task-card">
            <p>No tasks yet</p>
            <span>Create your first task 🚀</span>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => {
              /* ===== DUE DATE LOGIC (ADDED) ===== */
              const dueDate = task.due_date
                ? new Date(task.due_date).setHours(0, 0, 0, 0)
                : null;

              const isOverdue =
                dueDate && dueDate < today && task.status !== "done";

              const isToday = dueDate && dueDate === today;

              return (
                <div
                  className={`task-card ${
                    isOverdue ? "overdue" : ""
                  } ${isToday ? "due-today" : ""}`}
                  key={task.task_id}
                >
                  <div className="task-header">
                    <div className="task-left">
                      <input
                        type="checkbox"
                        checked={task.status === "done"}
                        onChange={() => toggleDone(task)}
                      />

                      <div>
                        <strong>{task.title}</strong>
                        {task.description && <p>{task.description}</p>}
                      </div>
                    </div>

                    <div className="task-actions">
                      <span className={`status-chip ${task.status}`}>
                        {task.status.replace("_", " ")}
                      </span>

                      <span
                        className={`priority-chip ${
                          task.priority >= 3
                            ? "high"
                            : task.priority === 2
                            ? "medium"
                            : "low"
                        }`}
                      >
                        Priority {task.priority}
                      </span>

                      <button
                        className="icon-btn"
                        onClick={() => {
                          setEditingTask(task);
                          setTitle(task.title);
                          setDescription(task.description || "");
                          setPriority(task.priority);
                          setStatus(task.status);
                          setShowModal(true);
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        className="icon-btn"
                        onClick={() => deleteTask(task.task_id)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingTask ? "Edit Task" : "Create Task"}</h3>

            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="chip-group">
              {["Low", "Medium", "High", "Urgent"].map((label, i) => (
                <div
                  key={label}
                  className={`chip ${priority === i + 1 ? "active" : ""}`}
                  onClick={() => setPriority(i + 1)}
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="chip-group">
              {["todo", "in_progress", "done"].map((s) => (
                <div
                  key={s}
                  className={`chip ${status === s ? "active" : ""}`}
                  onClick={() => setStatus(s)}
                >
                  {s.replace("_", " ")}
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="secondary-btn" onClick={resetModal}>
                Cancel
              </button>
              <button className="primary-btn" onClick={saveTask}>
                {editingTask ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
