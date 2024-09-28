export default async function handler(req, res) {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: "Missing start or end date" });
  }

  const apiUrl = `https://vnz.osvita.net/WidgetSchedule.asmx/GetScheduleDataX?callback=jsonp1727542856195&aVuzID=11613&aStudyGroupID=%22K2K3ZY5AE2ZA%22&aStartDate=%22${start}%22&aEndDate=%22${end}%22&aStudyTypeID=null`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.text();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
}
