const { commandList, commandWithParamsList } = require("./list/commandList");
const { actions } = require("./list/actions");
const { botWrapper } = require("./wrapper");
const { port, token } = require("./env");
const { commandArr } = require("./message/helpText");

const requireDir = require("require-dir");
const serviceClasses = requireDir("./service");
const services = Object.keys(serviceClasses).reduce(
  (memo, service) => ({ ...memo, [service]: new serviceClasses[service]() }),
  {}
);

const commandIterator = (bot) => {
  bot.start(botWrapper(services["utilService"], "start"));
  bot.on("callback_query", logUpdateMessage);
  setupCommands(bot);
  setupActions(bot);
  bot.on("sticker", logUpdateMessage);
  bot.on("animation", logUpdateMessage);
  bot.help(botWrapper(services["utilService"], "help"));
  bot.telegram.setMyCommands(commandArr);
  bot.launch();
};

const setupCommands = (bot) => {
  commandList
    .map((c) => "/" + c)
    .concat(commandWithParamsList)
    .sort()
    .reverse()
    .forEach((command) => {
      const commandArr = command.split(" ");
      bot.hears(
        new RegExp(
          `^(${commandArr[0]}|${commandArr[0]}@laplusdarknesssssbot)\s*.*`
        ),
        botWrapper(services[commandArr[1]], `${commandArr[2]}`)
      );
    });
};

const setupActions = (bot) => {
  actions.forEach((action) => {
    bot.action(
      action[0].callback_data,
      botWrapper(services[action[0].service], `${action[0].callback_data}`)
    );
  });
};

const logUpdateMessage = (ctx) => {
  console.log(ctx.update.callback_query);
  console.log(ctx.update.message);
};

module.exports = { commandIterator };
