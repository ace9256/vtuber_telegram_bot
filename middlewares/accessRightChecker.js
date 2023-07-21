const { commandAccessRight } = require("../list/chatList");
const { sendMessage } = require("../helper/telegramHelper");

const accessRightChecker = async (ctx) => {
  if (
    ctx.update.message?.chat.id.toString() &&
    !commandAccessRight.includes(ctx.update.message.chat.id.toString())
  ) {
    await sendMessage(ctx, "你沒有權限用此功能");
    throw new Error(
      `${ctx.update.message.chat.id.toString()} 嘗試使用此bot ${JSON.stringify(
        ctx
      )}`
    );
  }
};

module.exports = { accessRightChecker };
