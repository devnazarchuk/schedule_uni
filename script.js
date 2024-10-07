// Знаходимо елементи
const scheduleTable = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];
const groupSelect = document.getElementById('groupSelect');
const themeToggle = document.getElementById('themeToggle');
let isDarkTheme = false;

// Функція для форматування дати у формат "dd.mm.yyyy"
function formatDate(date) {
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Отримання поточної дати і кінець тижня
let currentDate = new Date();
let startDate = new Date();
let endDate = new Date();
endDate.setDate(startDate.getDate() + 7);

// Оновлюємо розклад при зміні групи
groupSelect.addEventListener('change', fetchSchedule);

// Функція для отримання розкладу з сервера
function fetchSchedule() {
  let groupID = groupSelect.value;
  let formattedStartDate = formatDate(startDate);
  let formattedEndDate = formatDate(endDate);

  let url = `https://vnz.osvita.net/WidgetSchedule.asmx/GetScheduleDataX?callback=jsonp&_=${Date.now()}&aVuzID=11613&aStudyGroupID=%22${groupID}%22&aStartDate=%22${formattedStartDate}%22&aEndDate=%22${formattedEndDate}%22&aStudyTypeID=null`;

  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script); // Додаємо скрипт для JSONP запиту
}

// Функція для обробки відповіді JSONP
function jsonp(data) {
  scheduleTable.innerHTML = '';  // Очищаємо таблицю

  data.d.forEach(row => {
    let newRow = scheduleTable.insertRow();
    newRow.insertCell(0).innerText = row.full_date;
    newRow.insertCell(1).innerText = `${row.study_time_begin} - ${row.study_time_end}`;
    newRow.insertCell(2).innerText = row.discipline;
    newRow.insertCell(3).innerText = row.study_type;
    newRow.insertCell(4).innerText = row.cabinet;
    newRow.insertCell(5).innerText = row.employee;
    
    // Додаємо клас для фарбування предметів
    newRow.classList.add('subject-' + row.discipline.toLowerCase());

    // Виділяємо сьогоднішню дату
    if (row.full_date === formatDate(new Date())) {
      newRow.classList.add('today-date');
    }
  });

  highlightToday();
}

// Функція для виділення сьогоднішньої дати
function highlightToday() {
  let today = formatDate(new Date());
  let rows = scheduleTable.getElementsByTagName('tr');
  for (let row of rows) {
    let dateCell = row.cells[0];
    if (dateCell && dateCell.innerText === today) {
      row.classList.add('today-date');
    }
  }
}

// Перемикання теми
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  isDarkTheme = !isDarkTheme;
  themeToggle.innerText = isDarkTheme ? "🌙" : "☀️";
});

// Завантаження даних при старті сторінки
window.onload = function() {
  fetchSchedule();
};