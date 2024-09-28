import React, { useEffect, useState } from "react";

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const startDate = "2024-09-28"; // або будь-яка змінна
  const endDate = "2024-10-05"; // або будь-яка змінна

  useEffect(() => {
    fetchSchedule(startDate, endDate);
  }, [startDate, endDate]);

  const fetchSchedule = (startDate, endDate) => {
    const script = document.createElement("script");
    script.src = `https://vnz.osvita.net/WidgetSchedule.asmx/GetScheduleDataX?callback=jsonpCallback&aVuzID=11613&aStudyGroupID=%22K2K3ZY5AE2ZA%22&aStartDate=%22${startDate}%22&aEndDate=%22${endDate}%22&aStudyTypeID=null`;
    document.body.appendChild(script);
  };

  const jsonpCallback = (response) => {
    if (response && response.d) {
      setScheduleData(response.d); // Припустимо, що response.d - це масив даних
      setLoading(false);
    } else {
      console.error("No data received");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Schedule</h1>
      {scheduleData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Column 1</th>
              <th>Column 2</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((item, index) => (
              <tr key={index}>
                <td>{item.column1}</td>
                <td>{item.column2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default Schedule;
