// Функція для форматування дати у формат "dd.mm.yyyy"
function formatDate(date) {
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Отримуємо поточну дату і обчислюємо кінець тижня
let currentDate = new Date(); // Початок: сьогодні
let startDate = new Date(currentDate); // Дата початку
let endDate = new Date(currentDate);
endDate.setDate(startDate.getDate() + 7); // Кінець: через 7 днів

// Формуємо URL з динамічними датами
function createUrl() {
  let formattedStartDate = formatDate(startDate);
  let formattedEndDate = formatDate(endDate);
  return `https://vnz.osvita.net/WidgetSchedule.asmx/GetScheduleDataX?callback=jsonp&_=1727543390250&aVuzID=11613&aStudyGroupID=%22K2K3ZY5AE2ZA%22&aStartDate=%22${formattedStartDate}%22&aEndDate=%22${formattedEndDate}%22&aStudyTypeID=null`;
}

// Функція для отримання та відображення розкладу
function fetchSchedule() {
  const script = document.createElement("script");
  script.src = createUrl();
  document.body.appendChild(script);
}

// Обробник JSONP відповіді
function jsonp(data) {
  const scheduleTable = document
    .getElementById("schedule-table")
    .getElementsByTagName("tbody")[0];
  scheduleTable.innerHTML = ""; // Очищаємо таблицю перед новим запитом

  if (data.d) {
    data.d.forEach((row) => {
      let newRow = scheduleTable.insertRow();

      newRow.insertCell(0).innerText = row.full_date;
      newRow.insertCell(1).innerText =
        row.study_time_begin + " - " + row.study_time_end;
      newRow.insertCell(2).innerText = row.discipline;
      newRow.insertCell(3).innerText = row.study_type;
      newRow.insertCell(4).innerText = row.cabinet;
      newRow.insertCell(5).innerText = row.employee;
    });
  } else {
    // Якщо даних немає
    let newRow = scheduleTable.insertRow();
    newRow.insertCell(0).colSpan = 6;
    newRow.innerText = "Немає даних для відображення.";
  }
}

// Обробники подій для кнопок
document.getElementById("prevDate").addEventListener("click", () => {
  startDate.setDate(startDate.getDate() - 7);
  endDate.setDate(endDate.getDate() - 7);
  fetchSchedule();
});

document.getElementById("currentDate").addEventListener("click", () => {
  startDate = new Date(currentDate);
  endDate.setDate(startDate.getDate() + 7);
  fetchSchedule();
});

document.getElementById("nextDate").addEventListener("click", () => {
  startDate.setDate(startDate.getDate() + 7);
  endDate.setDate(endDate.getDate() + 7);
  fetchSchedule();
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

// Виклик функції отримання розкладу
fetchSchedule();
