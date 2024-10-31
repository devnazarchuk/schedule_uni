// Форматування дати у формат "dd.mm.yyyy"
const formatDate = (date) => `${("0" + date.getDate()).slice(-2)}.${("0" + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;

// Глобальні змінні
let currentDate = new Date(), startDate = new Date(currentDate), endDate = new Date(startDate),
    groupID = "K2K3ZY5AE2ZA", selectedDiscipline = 'all';

startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Понеділок поточного тижня
endDate.setDate(startDate.getDate() + 4); // П'ятниця поточного тижня

// Отримуємо розклад для групи
const fetchSchedule = () => {
    const formattedStartDate = formatDate(startDate), formattedEndDate = formatDate(endDate);
    const url = `https://vnz.osvita.net/WidgetSchedule.asmx/GetScheduleDataX?callback=jsonp&_=1727543390250&aVuzID=11613&aStudyGroupID=%22${groupID}%22&aStartDate=%22${formattedStartDate}%22&aEndDate=%22${formattedEndDate}%22&aStudyTypeID=null`;

    titleGroup.textContent = (groupID === "K2K3ZY5AE2ZA") ? "Розклад занять групи КН-11" : "Розклад занять групи КН-12";

    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
};

// Відображення отриманого JSONP розкладу
function jsonp(data) {
    scheduleTable.innerHTML = '';
    data.d.forEach(row => {
        const rowDate = new Date(row.full_date), newRow = scheduleTable.insertRow();

        newRow.classList.toggle('today-row', rowDate.toDateString() === currentDate.toDateString());
        newRow.innerHTML = `
            <td>${row.full_date}</td>
            <td>${row.study_time_begin} - ${row.study_time_end}</td>
            <td>${row.discipline}</td>
            <td>${row.study_type}</td>
            <td>${row.cabinet}</td>
            <td>${row.employee}</td>`;
    });
    applyDisciplineFilter();
}

// Застосування фільтра вибраної дисципліни
function applyDisciplineFilter() {
    const rows = scheduleTable.getElementsByTagName('tr');
    for (let row of rows) {
        const discipline = row.cells[2].innerText;
        row.style.display = (selectedDiscipline === 'all' || discipline === selectedDiscipline) ? '' : 'none';
    }
}

// Скидання фільтра
function showAllSchedule() {
    document.getElementById('exportCSV').style.display ="none"
    selectedDiscipline = 'all';
    fetchSchedule();
}

// Оновлення групи, тижня, дати
document.getElementById('groupSelect').addEventListener('change', (event) => {
    groupID = event.target.value;
    fetchSchedule();
});
document.getElementById('disciplineSelect').addEventListener('change', (event) => {
    selectedDiscipline = event.target.value;
    applyDisciplineFilter();
});
document.getElementById('prevDate').addEventListener('click', () => changeWeek(-7));
document.getElementById('nextDate').addEventListener('click', () => changeWeek(7));
document.getElementById('currentDate').addEventListener('click', resetDate);

// Зміна теми
document.getElementById('themeToggle').addEventListener('click', () => document.body.classList.toggle('dark-theme'));

// Ініціалізація основного розкладу
fetchSchedule();
const scheduleTable = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];

// Кнопка експорту CSV
document.getElementById('exportCSV').addEventListener('click', () => exportToCSV(scheduleTable));

// Показ розкладу при переході між тижнями
function changeWeek(days) {
    startDate.setDate(startDate.getDate() + days);
    endDate.setDate(endDate.getDate() + days);
    fetchSchedule();
}

// Повернення до поточного тижня
function resetDate() {
    startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4);
    fetchSchedule();
}

// Експорт до CSV
function exportToCSV(table) {
    let csvContent = "data:text/csv;charset=utf-8,";
    for (let row of table.rows) {
        const cols = row.cells, rowData = [];
        for (let col of cols) rowData.push(col.innerText);
        csvContent += rowData.join(",") + "\r\n";
    }
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'schedule.csv');
    document.body.appendChild(link);
    link.click();
}
// Функція для показу підсумку
function showSummary() {
    subjectSummary = {}; // Очищаємо старі дані підсумків
    document.getElementById('exportCSV').style.display ="inline"
    document.getElementById('groupSelect').style.display ="none"
    document.getElementById('disciplineSelect').style.display ="none"
    document.getElementById("showSummary").textContent ="Оновити підсумок"
    // Заповнюємо об'єкт subjectSummary даними з розкладу
    const rows = scheduleTable.getElementsByTagName('tr');
    for (let row of rows) {
        const discipline = row.cells[2].innerText; // Назва предмету
        const studyType = row.cells[3].innerText; // Тип заняття (лекція/практика)

        // Якщо предмет вже є в об'єкті, збільшуємо лічильник
        if (subjectSummary[discipline]) {
            subjectSummary[discipline].count++;
        } else {
            subjectSummary[discipline] = { count: 1, studyType: studyType };
        }
    }

    // Очищаємо та заповнюємо summaryTable
    const summaryTable = document.getElementById('summary-table');
    summaryTable.innerHTML = ''; // Очищаємо таблицю
    const summaryHeader = summaryTable.createTHead();
    const headerRow = summaryHeader.insertRow();
    headerRow.insertCell(0).innerText = 'Предмет';
    headerRow.insertCell(1).innerText = 'Кількість';
    headerRow.insertCell(2).innerText = 'Тип заняття';

    const summaryBody = summaryTable.createTBody();
    for (let discipline in subjectSummary) {
        const row = summaryBody.insertRow();
        row.insertCell(0).innerText = discipline;
        row.insertCell(1).innerText = subjectSummary[discipline].count;
        row.insertCell(2).innerText = subjectSummary[discipline].studyType;

        // Додаємо обробник подій для натискання на предмет
        row.addEventListener('click', () => {
            showDetailedSchedule(discipline);
            document.getElementById('detailed-container').style.display = 'block'; // Показуємо деталі
        });

        // Додаємо стиль для рядка
        row.style.cursor = 'pointer'; // Курсор у вигляді руки
        row.onmouseover = () => row.style.backgroundColor = '#8fbcff'; // Зміна кольору при наведенні
        row.onmouseout = () => row.style.backgroundColor = ''; // Відновлення кольору
    }

    // Сховати основну таблицю та показати таблицю підсумків
    document.getElementById('schedule-table').style.display = 'none';
    document.getElementById('summary-container').style.display = 'block';
        document.getElementById("showAllSchedule").style.display ="inline"
}

// Функція для показу детального розкладу
function showDetailedSchedule(discipline) {
    const detailedTable = document.getElementById('detailed-table');
    detailedTable.innerHTML = ''; // Очищаємо таблицю

    const detailedHeader = detailedTable.createTHead();
    const headerRow = detailedHeader.insertRow();
    headerRow.insertCell(0).innerText = 'Дата';
    headerRow.insertCell(1).innerText = 'Час';
    headerRow.insertCell(2).innerText = 'Тип заняття';
    headerRow.insertCell(3).innerText = 'Аудиторія';
    headerRow.insertCell(4).innerText = 'Викладач';

    const detailedBody = detailedTable.createTBody();

    // Фільтруємо дані для вибраного предмета
    const rows = scheduleTable.getElementsByTagName('tr');
    for (let row of rows) {
        if (row.cells[2].innerText === discipline) {
            const newRow = detailedBody.insertRow();
            newRow.insertCell(0).innerText = row.cells[0].innerText; // Дата
            newRow.insertCell(1).innerText = row.cells[1].innerText; // Час
            newRow.insertCell(2).innerText = row.cells[3].innerText; // Тип заняття
            newRow.insertCell(3).innerText = row.cells[4].innerText; // Аудиторія
            newRow.insertCell(4).innerText = row.cells[5].innerText; // Викладач
        }
    }

    // Якщо детальна інформація не знайдена, відобразити повідомлення
    if (detailedBody.rows.length === 0) {
        const messageRow = detailedBody.insertRow();
        const messageCell = messageRow.insertCell(0);
        messageCell.colSpan = 5; // Злийте стовпці
        messageCell.innerText = 'Немає деталей для цього предмета';
    }
}

// Додаємо обробник події для кнопки "Показати підсумок"
document.getElementById('showSummary').addEventListener('click', showSummary);

// Обробник для кнопки "Показати увесь розклад"
document.getElementById('showAllSchedule').addEventListener('click', () => {
    document.getElementById('summary-container').style.display = 'none';
    document.getElementById('detailed-container').style.display = 'none';
    document.getElementById('schedule-table').style.display = 'block';
    document.getElementById('exportCSV').style.display ="inline"
    document.getElementById("showSummary").textContent ="Підсумок тижня"
    document.getElementById("showAllSchedule").style.display ="none"
    fetchSchedule(); // Оновлюємо розклад
});
