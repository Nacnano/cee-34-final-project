const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysList = document.querySelector(".days");
const prevBtn = document.querySelector(".prev-month-btn");
const nextBtn = document.querySelector(".next-month-btn");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const tasks = document.querySelector(".task");
const addReminderBtn = document.querySelector(".add-reminder-btn");
const deleteReminderBtn = document.querySelector(".delete-reminder-btn");
const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");
const confirmBtn = document.querySelector(".confirm");
const reminderMessageInput = document.querySelector(".reminder-message");
const reminderDateInput = document.querySelector("reminder-date");

//Local -> will change to IPV4 public
const BackendURL = "http://127.0.0.1:3000";
// const BackendURL = 'http://52.0.226.204:3000'

let currDay = new Date();
let activeDay;
let month = currDay.getMonth();
let year = currDay.getFullYear();
let loader;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let assignmentsList = [];
let remindersList = [];

async function renderPage() {
  createCalendar();
  addLoading();

  await getCourses().then(() => {
    createCalendar();
  });

  await getReminders().then(() => {
    createCalendar();
    RemoveLoading();
  });
}

function addLoading() {
  const loaderDiv = `<div class='loader'/>'`;
  tasks.innerHTML = loaderDiv;
  loader = document.getElementsByClassName("loader")[0];
  loader.style.display = "block";
}

function RemoveLoading() {
  loader.style.display = "none";
}

function createCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-month">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let isEvent = false;

    if (assignmentsList)
      assignmentsList.forEach((assignment) => {
        if (
          assignment.day === i &&
          assignment.month === month + 1 &&
          assignment.year === year
        ) {
          isEvent = true;
        }
      });

    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      updateEvents(i);
      if (isEvent) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (isEvent) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-month">${j}</div>`;
  }

  daysList.innerHTML = days;
  addDaysListener();
}

function prevMonthBtnHandler() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  createCalendar();
}

prevBtn.addEventListener("click", prevMonthBtnHandler);

function nextMonthBtnHandler() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  createCalendar();
}

nextBtn.addEventListener("click", nextMonthBtnHandler);

function addDaysListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      days.forEach((day) => {
        day.classList.remove("active");
      });
      if (e.target.classList.contains("prev-month")) {
        prevMonthBtnHandler();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (day.classList.contains("active")) {
              day.classList.remove("active");
            }
            if (
              !day.classList.contains("prev-month") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-month")) {
        nextMonthBtnHandler();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (day.classList.contains("active")) {
              day.classList.remove("active");
            }
            if (
              !day.classList.contains("next-month") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  createCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      dateInput.value = "";
      createCalendar();
      return;
    }
  }
  alert("Invalid Date");
}
//TODO: Make this function work
function updateEvents(date) {
  let assignments = "";

  if (assignmentsList)
    assignmentsList.forEach((assignment) => {
      if (
        date === assignment.day &&
        month + 1 === assignment.month &&
        year === assignment.year
      ) {
        assignments += `        <div class="assignment">
    <div class = "info">
      <div class="imageHolder">
        <img class="course-icon" src="${assignment.courseImage}" alt="course-icon">
      </div>
      <div class="assignment-info">
        <h5 class="course-title">${assignment.courseTitle}</h3>
        <h4 class="assignment-title">${assignment.title}</h4>
      </div>
    </div>
    <div class = "due-date">${assignment.dueDate}</div>
  </div>`;
      }
    });

  if (assignments === "") {
    assignments = `<div class="no-assignment">
          <h4>No Assignment</h4>
      </div>`;
  }
  tasks.innerHTML = assignments;
}

const getUserProfile = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const url = new URL(`${BackendURL}/courseville/me`);
  return await fetch(url, options).then((response) => response.json());
};

async function getCourses() {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const url = new URL(`${BackendURL}/courseville/get_courses`);

  let course_info = [];
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    for (const info of data) {
      const assignment = await getCoursesAssignments(info.cv_cid);
      if (!assignment || !assignment.data) continue;

      for (const assignmentInfo of assignment.data) {
        if (assignmentInfo.duedate === null) continue;
        const [year, month, day] = assignmentInfo.duedate.split("-");
        const course = {
          day: Number(day),
          month: Number(month),
          year: Number(year),
          courseTitle: info.title,
          title: assignmentInfo.title,
          courseImage: info.course_icon,
          cv_cid: info.cv_cid,
          dueDate: assignmentInfo.duedate,
        };
        course_info.push(course);
      }
    }
    const lastYear = course_info.reduce((prev, curr) =>
      prev.year > curr.year ? prev.year : curr.year
    );
    course_info = course_info.filter((course) => course.year == lastYear);
    console.log(course_info);
    assignmentsList = course_info;
  } catch (err) {
    console.log("Error: ", err);
    return null;
  }
}

async function getCoursesAssignments(cv_cid) {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const url = new URL(
    `${BackendURL}/courseville/get_course_assignments/` + cv_cid
  );
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("ERROR");
    console.log(err);
    return null;
  }
}

async function getReminders() {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const url = new URL(`${BackendURL}/assignments/`);
  try {
    const res = await fetch(url, options).then(
      async (res) => (remindersList = await res.json())
    );
    console.log(remindersList);
  } catch (err) {
    console.log("ERROR");
    console.log(err);
    return null;
  }
  // Todo: then Show reminders
}

// Todo: Show new reminder after adding
// (probably with new format based on data type)
// async function showReminder (reminderData) {
//   tasks.innerHTML = ''
//   reminderData.sort((a, b) => {
//     return a.created_date - b.created_date
//   })
//   reminderData.map(reminder => {
//     tasks.innerHTML += `<div class="reminder">
//     <div class="reminder-info">
//               <h4 class="reminder-title">${reminder.item}</h4>
//             </div>
//   </div>`
//   })
// }

async function addReminder() {
  reminderMessage = document.querySelector(".reminder-message");
  reminderDate = document.querySelector(".reminder-date");
  reminderData = {
    message: reminderInfo.value,
    date: reminderDate.value,
  };
  options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(reminderData),
  };

  await fetch(`${BackendURL}/assignments/`, options)
    .then((res) => res.json)
    .catch((err) => {
      console.error(err);
    });

  //Todo: Clear the input box to empty string
}

addReminderBtn.addEventListener("click", async () => {
  await addReminder();
});

async function deleteReminder(reminder_id) {
  const options = {
    method: "DELETE",
    credentials: "include",
  };
  await fetch(`${BackendURL}/assignments/${reminder_id}`, options)
    .then((res) => res)
    .catch((err) => {
      console.error(err);
    });
}

//Todo: add reminderId from the one you want to delete
// deleteReminderBtn.addEventListener(
//   'click',
//   async () => await deleteReminder(reminderId)
// )

loginBtn.addEventListener("click", () => {
  window.location.href = `${BackendURL}/courseville/auth_app`;
});

logoutBtn.addEventListener("click", () => {
  window.location.href = `${BackendURL}/courseville/logout`;
});

document.addEventListener("DOMContentLoaded", async function () {
  await renderPage();
});
