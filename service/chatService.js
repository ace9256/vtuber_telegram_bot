const { sendSticker, sendMessage } = require("../helper/telegramHelper");
const { chatScriptList } = require("../list/chatScriptList");
const { memberList } = require("../list/chatList");

class ChatService {
  constructor() {}

  async genChatScript(ctx) {
    const botSuffix = "@laplusdarknesssssbot";
    const chatScript =
      chatScriptList[ctx.match[0].replace("@laplusdarknesssssbot", "")];
    if (!chatScript) return;
    let [stickerIdx, messageIdx] = [0, 0];
    for (const step of chatScript.order) {
      if (step === "sticker") {
        await sendSticker(ctx, chatScript.sticker?.[stickerIdx++], {
          reply: ctx.update.message.reply_to_message,
        });
      } else if (step === "message") {
        await sendMessage(ctx, chatScript.message?.[messageIdx++], {
          reply: ctx.update.message.reply_to_message,
        });
      }
    }
  }

  async well(ctx) {
    const args = ctx.match.input.split(" ");
    if (args[1]) {
      await sendMessage(ctx, `${args[1]}: 屌又係棍dee式鳩屎留言`, {
        reply: ctx.update.message.reply_to_message,
      });
    }
    await sendSticker(
      ctx,
      "CgACAgUAAxkBAAIN5WOQkwUOgH4Und1aYqcREZl03KTDAAJhCQACZVgQVGNN2RpfoGdDKwQ",
      {
        reply: ctx.update.message.reply_to_message,
      }
    );
  }

  async noNeed(ctx) {
    const args = ctx.match.input.split(" ");
    if (args[1]) {
      return await sendMessage(ctx, `${args[1]}: 牙棍不了`, {
        reply: ctx.update.message.reply_to_message,
      });
    }
    await sendMessage(ctx, "棍: 不了", {
      reply: ctx.update.message.reply_to_message,
    });
  }

  async fiftyFifty(ctx) {
    const replyToMessage = ctx.update.message.reply_to_message;
    const isQuote = replyToMessage && replyToMessage.text;

    if (
      isQuote &&
      replyToMessage.text[0].match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/)
    ) {
      return await sendMessage(ctx, "唔好quote符號啦", {
        reply: replyToMessage,
      });
    }

    const verb = isQuote
      ? replyToMessage.text.match(/^([A-Za-z]+)/)?.[0] || replyToMessage.text[0]
      : "";

    await sendMessage(
      ctx,
      Math.random() > 0.5
        ? isQuote
          ? verb
          : "98"
        : isQuote
        ? "唔" + verb
        : "不了",
      {
        reply: replyToMessage,
      }
    );
  }

  async random100(ctx) {
    const sentences = [
      "My road is My road! Jastis!!",
      "Pawar is pawar!! Pawar is pawar!!",
      "I want peropero shoes.",
      "Fack Fack O Fack desuwa",
      "Super Chat everyone. and  Coment everyone. and watch me... you!!",
      "So thank you much!!",
    ];
    await sendMessage(
      ctx,
      sentences[Math.floor(Math.random() * sentences.length)]
    );
  }

  async tagAll(ctx) {
    console.log(ctx.update.message.reply_to_message);
    console.log(ctx);
    await sendMessage(
      ctx,
      `\`${memberList[ctx.update.message.chat.id]
        ?.sort()
        .map((handle) => `@${handle}`)
        .join(" ")}\`\nClick to copy⤴️`,
      { parse_mode: "MarkdownV2" }
    );
  }
}

module.exports = ChatService;
