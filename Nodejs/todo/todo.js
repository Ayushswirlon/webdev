//here we are going to use command line interface to get task and argument and then gonna execute it in node environment
const { error, log } = require("console");
const fs = require("fs");
const filePath = "./tasks.json";

const loadTasks = () => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (error) {
    return [];
  }
};

const saveTask = (tasks) => {
  const dataJSON = JSON.stringify(tasks);
  fs.writeFileSync(filePath, dataJSON);
};

const addTAsk = (task) => {
  const tasks = loadTasks();
  tasks.push({ task });
  saveTask(tasks);
  console.log("Task Added " + task);
};

const listTask = () => {
  const tasks = loadTasks();
  tasks.forEach((element, counter) => {
    counter++;
    console.log(`${counter}-${element.task}`);
  });
};

const removeTask = (task) => {
  const tasks = loadTasks();
  tasks.forEach((element, counter) => {
    if (element.task.toLowerCase() == task.toLowerCase()) {
      tasks.splice(counter, 1);
      console.log("item removed");
    }
    counter++;
  });
  saveTask(tasks);
};
// argv returns array 0th - node/bin/yarn
//1st- file address and after that items in command line
const command = process.argv[2];
const argument = process.argv[3];

if (command === "add") {
  if (argument) {
    addTAsk(argument);
  } else {
    console.log("argument is required");
  }
} else if (command === "list") {
  listTask();
} else if (command === "remove") {
  if (argument) {
    removeTask(argument);
  } else {
    console.log("argument is required");
  }
} else {
  console.log("invalid command");
}
