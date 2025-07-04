async function callApi() {
    MEMBERS = ["K.M.","M.F.","M.M."];
    DAY_OF_WEEK = ["（日）","（月）","（火）","（水）","（木）","（金）","（土）"];
    const res = await fetch("https://holidays-jp.github.io/api/v1/date.json");
    let data = await res.json();
    const HOLIDAYS =  Object.keys(data);
    let BaseDate = new Date(2025,1 - 1, 1);
    let today = new Date();

    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (yesterday.getDay() == 0) {
        yesterday.setDate(yesterday.getDate() - 2);
    } else if(yesterday.getDay() == 6){
        yesterday.setDate(yesterday.getDate() - 1);
    }

    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (tomorrow.getDay() == 0) {
        tomorrow.setDate(tomorrow.getDate() + 1);
    } else if(tomorrow.getDay() == 6){
        tomorrow.setDate(tomorrow.getDate() + 2);
    }

    let pastHolidays = 0;
    let pastWeekends = 0;
    let isHoliday = false;
    let currentDate = new Date(BaseDate);
    while (currentDate <= today) {
        if (currentDate.getDay() != 0 && currentDate.getDay() != 6) {
            let currentDateStr = currentDate.getFullYear() + "-" + ("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2);
            if (HOLIDAYS.includes(currentDateStr)) {
                pastHolidays++;
                if (currentDate >= today) {
                    isHoliday = true;
                }
            }
        } else {
            pastWeekends++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    let diff = Math.floor((today - BaseDate) / 86400000) - pastWeekends - pastHolidays;
    let hostTodayIndex = diff % MEMBERS.length;

    let hostYesterdayIndex = (hostTodayIndex + MEMBERS.length - 1) % MEMBERS.length;
    let hostTomorrowIndex = (hostTodayIndex + 1) % MEMBERS.length;

    $("#host-yesterday").text(MEMBERS[hostYesterdayIndex])
    if (today.getDay() == 0 || today.getDay() == 6 || isHoliday) {
        let holidayMessageElem = $("#host-today").parent();
        holidayMessageElem.empty();
        holidayMessageElem.text("今日はお休みです_(:3 」∠)_");
    } else {
        $("#host-today").text(MEMBERS[hostTodayIndex])
    }
    $("#host-tomorrow").text(MEMBERS[hostTomorrowIndex])

    $("#date-yesterday").text(yesterday.getMonth() + 1 + "/" + yesterday.getDate() + DAY_OF_WEEK[yesterday.getDay()])
    $("#date-today").text(today.getMonth() + 1 + "/" + today.getDate() + DAY_OF_WEEK[today.getDay()] + "（今日）")
    $("#date-tomorrow").text(tomorrow.getMonth() + 1 + "/" + tomorrow.getDate() + DAY_OF_WEEK[tomorrow.getDay()])
};

callApi();
