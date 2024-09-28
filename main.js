// Функція для форматування дати у формат "dd.mm.yyyy"
function formatDate(date) {
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Отримуємо поточну дату і обчислюємо кінець тижня
let startDate = new Date(); // Початок: сьогодні
let endDate = new Date();
endDate.setDate(startDate.getDate() + 7); // Кінець: через 7 днів

// Форматуємо дати
let formattedStartDate = formatDate(startDate);
let formattedEndDate = formatDate(endDate);

// Формуємо URL з динамічними датами
let url = `https://vnz.osvita.net/WidgetSchedule.asmx/GetScheduleDataX?callback=jsonp1727542856195&aVuzID=11613&aStudyGroupID=%22K2K3ZY5AE2ZA%22&aStartDate=%22${startDate}%22&aEndDate=%22${endDate}%22&aStudyTypeID=null`;

// Функція для отримання та відображення розкладу
function fetchSchedule() {
  const script = document.createElement("script");
  script.src = url;
  document.body.appendChild(script);
}

// Обробник JSONP відповіді
function jsonp(data) {
  const scheduleTable = document
    .getElementById("schedule-table")
    .getElementsByTagName("tbody")[0];
  scheduleTable.innerHTML = ""; // Очищаємо таблицю перед новим запитом

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
}

// Виклик функції отримання розкладу
fetchSchedule();
