const toDoList = document.querySelector(".to-do_list");
const taskInput = document.querySelector(".to-do_form-inputText");
const dateInput = document.querySelector(".to-do_form-inputDate");
const formSubmitButton = document.querySelector(".to-do_form-inputButton");
const select = document.querySelector(".to-do_sort");

const TasksArray = JSON.parse(sessionStorage.getItem("Tasks")) || [];

let sorted = false;

const getTime = (inputTime) => {
  const now = new Date();
  const inputDate = new Date(inputTime);

  if (!inputTime) return;
  if (inputDate < now) return;

  const timeLeft = inputDate.getTime() - now.getTime();
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return `${daysLeft} days, ${hoursLeft} hours, ${minutesLeft} minutes left`;
};

const PrepopulateArray = () => {
  const PrepopulatedTasks = [
    {
      task: "Buy bread",
      dateFormatted: getTime("2023-06-23T05:12"),
      date: "2023-06-23T05:12",
      completed: false,
      id: Date.now() + 1,
    },
    {
      task: "Go to the park",
      dateFormatted: getTime("2023-05-15T12:12"),
      date: "2023-05-15T12:12",
      completed: false,
      id: Date.now() + 2,
    },
    {
      task: "Play some chess",
      dateFormatted: getTime("2023-09-09T13:25"),
      date: "2023-09-09T13:25",
      completed: false,
      id: Date.now() + 3,
    },
    {
      task: "Wash the dishes",
      dateFormatted: getTime("2023-09-19T23:00"),
      date: "2023-09-19T23:00",
      completed: false,
      id: Date.now() + 4,
    },
  ];
  const Tasks = sessionStorage.getItem("Tasks");
  if (!Tasks) {
    sessionStorage.setItem("Tasks", JSON.stringify(PrepopulatedTasks));
  }
};
PrepopulateArray();

const addTask = (e) => {
  e.preventDefault();

  const newTask = {
    task: taskInput.value,
    dateFormatted: getTime(dateInput.value),
    date: dateInput.value,
    completed: false,
    id: Date.now(),
  };

  TasksArray.push(newTask);
  sessionStorage.setItem("Tasks", JSON.stringify(TasksArray));
  taskInput.value = "";
  dateInput.value = "";
  displayTask(newTask);
};

const displayTask = (task) => {
  const html = `
    ${
      task.completed
        ? `<li data-id=${task.id} class="list-item completed ">`
        : `<li data-id=${task.id} class="list-item ">`
    }
    <h2 class="list-item_description">${task.task}</h2>
    ${
      task.dateFormatted
        ? `<p class="list-item_deadline">${task.dateFormatted}</p>`
        : ""
    }
    <div class="list-item_inputs">
    ${
      task.completed
        ? `<input type="checkbox" class="checkbox" id="completed" checked />`
        : `<input type="checkbox" class="checkbox" id="completed" />`
    }
    <button class="list-item_delete-button">Delete</button>
    </div>
    </li>`;

  task.completed && sorted !== true
    ? toDoList.insertAdjacentHTML("beforeend", html)
    : toDoList.insertAdjacentHTML("afterbegin", html);
};

const displayTasks = () => {
  TasksArray.forEach((task) => {
    displayTask(task);
  });
};
displayTasks();

const sortTasks = (array, sortOption) => {
  switch (sortOption) {
    case "recent":
      sorted = false;
      return array.slice().reverse();
    case "deadline":
      sorted = false;
      return array.slice().sort((a, b) => {
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();
        return bTime - aTime;
      });
    case "completed":
      sorted = true;
      const completedTasks = array.filter((task) => task.completed);
      const notCompletedTasks = array.filter((task) => !task.completed);
      return [...notCompletedTasks, ...completedTasks];

    default:
      return array;
  }
};

select.addEventListener("change", (e) => {
  const sortedTasks = sortTasks(TasksArray, e.target.value);
  toDoList.innerHTML = "";
  sortedTasks.forEach((task) => displayTask(task));
});

toDoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("list-item_delete-button")) {
    event.preventDefault();

    const confirmDelete = confirm("Are you sure you want to delete this item?");

    if (confirmDelete) {
      const listItem = event.target.closest(".list-item");
      const filteredArray = TasksArray.filter(
        (task) => task.id !== parseInt(listItem.dataset.id)
      );
      TasksArray.length = 0;
      TasksArray.push(...filteredArray);
      sessionStorage.setItem("Tasks", JSON.stringify(TasksArray));
      listItem.remove();
    }
  }

  if (event.target.classList.contains("checkbox")) {
    const listItem = event.target.closest(".list-item");
    const task = TasksArray.find(
      (task) => task.id === parseInt(listItem.dataset.id)
    );
    task.completed = event.target.checked;
    sessionStorage.setItem("Tasks", JSON.stringify(TasksArray));
    listItem.classList.toggle("completed");
    location.reload();
  }
});

formSubmitButton.addEventListener("click", addTask);
