const { intToString } = require("./intToString");

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Wed Jan 19 13:01:14 +0000 2022
const format = (time) => {
  let formattedTime = time.split(" ");
  let year = parseInt(formattedTime[5]);
  let month = months.indexOf(formattedTime[1]);
  let date = parseInt(formattedTime[2]);
  let hour = parseInt(formattedTime[3].split(":")[0]);
  let min = parseInt(formattedTime[3].split(":")[1]);
  let sec = parseInt(formattedTime[3].split(":")[2]);
  return new Date(year, month, date, hour, min, sec).toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
  });
};

// 2022-11-29T15:00:00.000Z
const format2 = (time) => {
  const addHours = function (time, h) {
    time.setTime(time.getTime() + h * 60 * 60 * 1000);
    return time;
  };
  const gMT8Time = addHours(new Date(time), 9);
  const month = intToString(gMT8Time.getMonth() + 1, 2);
  const date = intToString(gMT8Time.getDate(), 2);
  const hour = intToString(gMT8Time.getHours(), 2);
  const min = intToString(gMT8Time.getMinutes(), 2);
  return `${month}月 ${date}日 ${hour}時 ${min}分`;
};

module.exports = { format, format2 };
