const { Telegraf } = require("telegraf");
const { port, token } = require("./env");
const { expressListen } = require("./express");
const { commandIterator } = require("./commandIterator");
const { setupAlarm } = require("./alarmHandler");

expressListen(port);
commandIterator(new Telegraf(token));
setupAlarm();
