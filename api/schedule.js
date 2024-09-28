const fetchSchedule = (startDate, endDate) => {
  const script = document.createElement("script");
  script.src = `https://vnz.osvita.net/WidgetSchedule.asmx/GetScheduleDataX?callback=jsonpCallback&aVuzID=11613&aStudyGroupID=%22K2K3ZY5AE2ZA%22&aStartDate=%22${startDate}%22&aEndDate=%22${endDate}%22&aStudyTypeID=null`;
  document.body.appendChild(script);
};

const jsonpCallback = (response) => {
  if (response && response.d) {
    console.log(response.d); // Обробіть ваші дані тут
  } else {
    console.error("No data received");
  }
};
