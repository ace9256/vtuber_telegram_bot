const hour = (new Date().getHours() + 8) % 24;
const isMidNight = hour >= 0 && hour < 9;

module.exports = { isMidNight };
