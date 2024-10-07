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

// Функція для отримання розкладу (з фейковими даними для прикладу)
function fetchSchedule() {
  loadFakeData();
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

// Фейкові дані для прикладу
function loadFakeData() {
  scheduleTable.innerHTML = '';  // Очищаємо таблицю

  let fakeData = [
    { full_date: formatDate(startDate), study_time_begin: "09:00", study_time_end: "10:30", discipline: "Математика", study_type: "Лекція", cabinet: "101", employee: "Іванов І.І.", subjectClass: 'subject-math' },
    { full_date: formatDate(new Date(startDate.setDate(startDate.getDate() + 1))), study_time_begin: "11:00", study_time_end: "12:30", discipline: "Історія", study_type: "Практика", cabinet: "102", employee: "Петров П.П.", subjectClass: 'subject-history' },
    { full_date: formatDate(new Date(startDate.setDate(startDate.getDate() + 1))), study_time_begin: "13:00", study_time_end: "14:30", discipline: "Природничі науки", study_type: "Лабораторна", cabinet: "103", employee: "Сидоров С.С.", subjectClass: 'subject-science' }
  ];

  fakeData.forEach(row => {
    let newRow = scheduleTable.insertRow();
    newRow.insertCell(0).innerText = row.full_date;
    newRow.insertCell(1).innerText = `${row.study_time_begin} - ${row.study_time_end}`;
    newRow.insertCell(2).innerText = row.discipline;
    newRow.insertCell(3).innerText = row.study_type;
    newRow.insertCell(4).innerText = row.cabinet;
    newRow.insertCell(5).innerText = row.employee;
    newRow.classList.add(row.subjectClass);
  });

  highlightToday();
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