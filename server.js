const { Telegraf } = require("telegraf");
const { port, token } = require("./env");
const { expressListen } = require("./express");
const { commandIterator } = require("./commandIterator");
const { alarmHandler, getRoundedDate } = require("./alarmHandler");

expressListen(port);
commandIterator(new Telegraf(token));
setTimeout(() => {
  setInterval(async () => {
    await alarmHandler();
  }, 60000);
}, getRoundedDate(1, new Date()) - new Date());
