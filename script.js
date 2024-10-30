// Функція для форматування дати у формат "dd.mm.yyyy"
function formatDate(date) {
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Отримуємо поточну дату
let currentDate = new Date(); // Сьогоднішня дата
let startDate = new Date(currentDate);
startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Понеділок поточного тижня
let endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + 4); // П'ятниця поточного тижня

// Форматування дат
let formattedStartDate = formatDate(startDate);
let formattedEndDate = formatDate(endDate);

// Група за замовчуванням (КН-11)
let groupID = "K2K3ZY5AE2ZA";

// Формуємо URL для запиту
function fetchSchedule() {
    formattedStartDate = formatDate(startDate); // Оновлюємо форматовану початкову дату
    formattedEndDate = formatDate(endDate); // Оновлюємо форматовану кінцеву дату

    let url = `https://vnz.osvita.net/WidgetSchedule.asmx/GetScheduleDataX?callback=jsonp&_=1727543390250&aVuzID=11613&aStudyGroupID=%22${groupID}%22&aStartDate=%22${formattedStartDate}%22&aEndDate=%22${formattedEndDate}%22&aStudyTypeID=null`;
    if (groupID=="K2K3ZY5AE2ZA"){
        titleGroup.textContent = "Розклад занять групи КН-11"}
        else{
            titleGroup.textContent = "Розклад занять групи КН-12"
        }
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}

// Обробник JSONP відповіді
function jsonp(data) {
    const scheduleTable = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];
    scheduleTable.innerHTML = '';  // Очищуємо таблицю

    data.d.forEach(row => {
        let newRow = scheduleTable.insertRow();
        let rowDate = new Date(row.full_date);

        // Виділення рядків для сьогоднішнього дня
        if (rowDate.toDateString() === currentDate.toDateString()) {
            newRow.classList.add('today-row');
        }

        newRow.insertCell(0).innerText = row.full_date;
        newRow.insertCell(1).innerText = row.study_time_begin + ' - ' + row.study_time_end;
        newRow.insertCell(2).innerText = row.discipline;
        newRow.insertCell(3).innerText = row.study_type;
        newRow.insertCell(4).innerText = row.cabinet;
        newRow.insertCell(5).innerText = row.employee;
    });
}

// Зміна групи
document.getElementById('groupSelect').addEventListener('change', (event) => {
    groupID = event.target.value;
    titleGroup = document.getElementById("titleGroup")
    if (groupID=="K2K3ZY5AE2ZA"){
    titleGroup.textContent = "Розклад занять групи КН-11"}
    else{
        titleGroup.textContent = "Розклад занять групи КН-12"
    }
    fetchSchedule();
});

// Кнопки для зміни дати
document.getElementById('prevDate').addEventListener('click', () => {
    startDate.setDate(startDate.getDate() - 7);
    endDate.setDate(endDate.getDate() - 7);
    fetchSchedule();
});

document.getElementById('currentDate').addEventListener('click', () => {
    startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Понеділок поточного тижня
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4); // П'ятниця поточного тижня
    fetchSchedule();
});

document.getElementById('nextDate').addEventListener('click', () => {
    startDate.setDate(startDate.getDate() + 7);
    endDate.setDate(endDate.getDate() + 7);
    fetchSchedule();
});

// Додати обробник події для кнопки зміни теми
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Виклик функції отримання розкладу при завантаженні сторінки

document.getElementById('disciplineSelect').addEventListener('change', (event) => {
    const selectedDiscipline = event.target.value;
    const rows = scheduleTable.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const disciplineCell = rows[i].cells[2].innerText;
        rows[i].style.display = (selectedDiscipline === 'all' || disciplineCell === selectedDiscipline) ? '' : 'none';
    }
});

fetchSchedule();
const scheduleTable = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];
document.getElementById('exportCSV').addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const rows = scheduleTable.getElementsByTagName('tr');
    for (let row of rows) {
        const cols = row.getElementsByTagName('td');
        const rowData = [];
        for (let col of cols) {
            rowData.push(col.innerText);
        }
        csvContent += rowData.join(",") + "\r\n";
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'schedule.csv');
    document.body.appendChild(link);
    link.click();
});
