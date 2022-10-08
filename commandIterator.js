const { commandList, commandWithParamsList } = require("./list/commandList");
const { botWrapper } = require("./wrapper");
const { port, token } = require("./env");
const { commandArr } = require("./message/helpText");
const UtilService = require("./service/utilService");

const commandIterator = (bot) => {
  bot.start(botWrapper(new UtilService(), "start"));
  for (let command of commandList) {
    const commandArr = command.split(" ");
    const Klass = require(`./service/${commandArr[1]}`);
    bot.hears(`/${commandArr[0]}`, botWrapper(new Klass(), `${commandArr[2]}`));
    bot.hears(
      `/${commandArr[0]}@laplusdarknesssssbot`,
      botWrapper(new Klass(), `${commandArr[2]}`)
    );
  }
  for (let command of commandWithParamsList) {
    const commandArr = command.split(" ");
    const Klass = require(`./service/${commandArr[1]}`);
    bot.hears(
      new RegExp(`${commandArr[0]}`),
      botWrapper(new Klass(), `${commandArr[2]}`)
    );
  }
  // bot.on('sticker', ctx => {
  //   console.log(ctx.update.message)
  // })
  bot.on('animation', ctx => {
    console.log(ctx.update.message)
  })
  bot.help(botWrapper(new UtilService(), "help"));
  bot.telegram.setMyCommands(commandArr);
  bot.launch();
};

module.exports = { commandIterator };
