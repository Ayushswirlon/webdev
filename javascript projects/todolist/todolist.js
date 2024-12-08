document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("todo-input");
  const submitButton = document.getElementById("add-task-btn");
  const list = document.getElementById("todo-list");

  // Safely parse tasks from localStorage
  let tasks;
  try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  } catch (error) {
    console.error("Error parsing tasks from localStorage:", error);
    tasks = [];
  }

  tasks.forEach((task) => {
    renderTask(task);
  });

  submitButton.addEventListener("click", () => {
    let taskText = inputText.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    tasks.push(newTask);
    saveTasks(tasks);
    renderTask(newTask);
    inputText.value = "";
    console.log(tasks);
  });

  function renderTask(task) {
    // Implement rendering logic here (e.g., create DOM elements for the task)
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    if (task.completed) li.classList.add("completed");
    li.innerHTML = `
    <span>${task.text}<span>
    <button>delete</button>`;
    li.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      task.completed = !task.completed;
      li.classList.toggle("completed");
      saveTasks();
    });
    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation(); //prevent toggle from firing
      tasks = tasks.filter((t) => t.id !== task.id);
      li.remove();
      saveTasks();
    });

    list.append(li);
  }

  function saveTasks(task) {
    localStorage.setItem("tasks", JSON.stringify(task));
  }
});
