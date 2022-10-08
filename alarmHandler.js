const UtilService = require("./service/utilService");

const alarmHandler = async () => {
  try {
    await new UtilService().executeAlarm();
  } catch (e) {
    console.log(e);
  }
};

let getRoundedDate = (minutes, d = new Date()) => {
  let ms = 1000 * 60 * minutes; // convert minutes to ms
  let roundedDate = new Date(Math.ceil(d.getTime() / ms) * ms);

  return roundedDate;
};

module.exports = { alarmHandler, getRoundedDate };
