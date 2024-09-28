// api/schedule.js

export default async function handler(req, res) {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: "Start and end dates are required." });
  }

  try {
    const response = await fetch(
      `https://vnz.osvita.net/WidgetSchedule.asmx/GetScheduleDataX?callback=jsonpCallback&aVuzID=11613&aStudyGroupID=%22K2K3ZY5AE2ZA%22&aStartDate=%22${start}%22&aEndDate=%22${end}%22&aStudyTypeID=null`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data from the schedule API." });
    }

    const data = await response.text(); // Отримуємо текстовий результат
    const jsonData = JSON.parse(
      data.slice(data.indexOf("(") + 1, data.lastIndexOf(")"))
    ); // Обробка JSONP

    res.status(200).json(jsonData.d); // Відправка даних клієнту
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
