// script.js - Student Task Manager

const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-description");
const searchInput = document.getElementById("search");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

// Load saved tasks (if any)
let tasks = [];
try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a task
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (title === "") {
        return;
    }

    tasks.push({
        id: Date.now(),
        title: title,
        description: description,
        completed: false
    });

    saveTasks();
    form.reset();
    renderTasks();
});

// Search tasks
searchInput.addEventListener("input", renderTasks);

// Mark complete / delete (event delegation)
taskList.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);

    if (button.classList.contains("complete-btn")) {
        const task = tasks.find(function (t) {
            return t.id === id;
        });
        if (task) {
            task.completed = !task.completed;
        }
    }

    if (button.classList.contains("delete-btn")) {
        tasks = tasks.filter(function (t) {
            return t.id !== id;
        });
    }

    saveTasks();
    renderTasks();
});

// Show tasks (filtered by the search text)
function renderTasks() {
    const query = searchInput.value.trim().toLowerCase();

    const visibleTasks = tasks.filter(function (task) {
        return (
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query)
        );
    });

    taskList.innerHTML = "";

    visibleTasks.forEach(function (task) {
        const card = document.createElement("li");
        card.className = "task-card" + (task.completed ? " completed" : "");

        const heading = document.createElement("h3");
        heading.textContent = task.title;

        const text = document.createElement("p");
        text.textContent = task.description;

        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.dataset.id = task.id;
        completeBtn.textContent = task.completed ? "Undo" : "Complete";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.id = task.id;
        deleteBtn.textContent = "Delete";

        card.append(heading, text, completeBtn, " ", deleteBtn);
        taskList.appendChild(card);
    });

    emptyMessage.style.display = visibleTasks.length === 0 ? "block" : "none";
}

renderTasks();