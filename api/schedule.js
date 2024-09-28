export default async function handler(req, res) {
  const date = new Date();
  const startDate = date.toISOString().split("T")[0]; // формат YYYY-MM-DD
  date.setDate(date.getDate() + 7); // додаємо 7 днів
  const endDate = date.toISOString().split("T")[0]; // формат YYYY-MM-DD

  const apiUrl = `https://vnz.osvita.net/WidgetSchedule.asmx/GetScheduleDataX?callback=jsonp1727542856195&aVuzID=11613&aStudyGroupID=%22K2K3ZY5AE2ZA%22&aStartDate=%22${startDate}%22&aEndDate=%22${endDate}%22&aStudyTypeID=null`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.text();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
}
