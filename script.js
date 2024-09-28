document.addEventListener("DOMContentLoaded", () => {
  let currentDate = new Date();

  const updateSchedule = (startDate) => {
    // Тут ви можете реалізувати логіку для отримання даних розкладу
    // Для прикладу, просто оновлюємо таблицю з тестовими даними
    const tableBody = document.querySelector("#scheduleTable tbody");
    tableBody.innerHTML = ""; // Очищуємо таблицю

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
    weekDays.forEach((day) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${day}</td><td>Заняття з ${startDate.toLocaleDateString()}</td>`;
      tableBody.appendChild(row);
      startDate.setDate(startDate.getDate() + 1); // Зміна дати
    });
  };

  const setCurrentDate = () => {
    currentDate = new Date();
    updateSchedule(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay()
      )
    );
  };

  document.getElementById("prevDate").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 7);
    updateSchedule(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay()
      )
    );
  });

  document
    .getElementById("currentDate")
    .addEventListener("click", setCurrentDate);

  document.getElementById("nextDate").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 7);
    updateSchedule(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay()
      )
    );
  });

  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });

  setCurrentDate(); // Встановлюємо початкову дату
});
