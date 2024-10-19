// Функція для форматування дати
function formatDate(date) {
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Параметри для груп
let groupID = 'WHD6RSALOU79';  // За замовчуванням КН-11
let currentDate = new Date();
let startDate = new Date(currentDate);
let endDate = new Date(currentDate);
endDate.setDate(endDate.getDate() + 7);

// Функція для отримання розкладу
function fetchSchedule() {
    let formattedStartDate = formatDate(startDate);
    let formattedEndDate = formatDate(endDate);

    let url = `https://vnz.osvita.net/WidgetSchedule.asmx/GetScheduleDataX?callback=jsonp&_=1727543390250&aVuzID=11613&aStudyGroupID=%22${groupID}%22&aStartDate=%22${formattedStartDate}%22&aEndDate=%22${formattedEndDate}%22&aStudyTypeID=null`;

    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}

// JSONP callback
function jsonp(data) {
    const scheduleTable = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];
    scheduleTable.innerHTML = '';  // Очищуємо таблицю

    data.d.forEach(row => {
        let newRow = scheduleTable.insertRow();
        let currentRowDate = new Date(row.full_date);

        // Виділення сьогоднішньої дати
        if (currentRowDate.toDateString() === currentDate.toDateString()) {
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

// Функція для зміни групи
document.getElementById('groupSelect').addEventListener('change', (event) => {
    groupID = event.target.value;
    fetchSchedule();
});

// Кнопки зміни тижня
document.getElementById('prevDate').addEventListener('click', () => {
    startDate.setDate(startDate.getDate() - 7);
    endDate.setDate(endDate.getDate() - 7);
    fetchSchedule();
});

document.getElementById('nextDate').addEventListener('click', () => {
    startDate.setDate(startDate.getDate() + 7);
    endDate.setDate(endDate.getDate() + 7);
    fetchSchedule();
});

document.getElementById('currentDate').addEventListener('click', () => {
    startDate = new Date(currentDate);
    endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 7);
    fetchSchedule();
});

// Функція зміни теми
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Виклик функції отримання розкладу при завантаженні сторінки
fetchSchedule();
