const axios = require("axios");
const { token } = require("../env");

class ChatService {
  constructor() {}

  async well(ctx) {
    if (ctx.update.message.reply_to_message) {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: ctx.update.message.chat.id,
        text: "棍dee又鳩up",
        reply_to_message_id: ctx.update.message.reply_to_message
          ? ctx.update.message.reply_to_message.message_id
          : "",
      });
    } else {
      ctx.reply("棍dee又鳩up");
    }
  }

  async well2(ctx) {
    if (ctx.update.message.reply_to_message) {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: ctx.update.message.chat.id,
        text: "老公又鳩up",
        reply_to_message_id: ctx.update.message.reply_to_message
          ? ctx.update.message.reply_to_message.message_id
          : "",
      });
    } else {
      ctx.reply("老公又鳩up");
    }
  }

  async noNeed(ctx) {
    console.log(ctx.update.message);
    ctx.reply("棍: 不了");
  }

  async greeting(ctx) {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: "ｱﾆｭｲ",
      reply_to_message_id: ctx.update.message.message_id,
    });
  }

  async fiftyFifty(ctx) {
    const isQuote =
      ctx.update.message.reply_to_message &&
      ctx.update.message.reply_to_message.text;
    if (
      isQuote &&
      ctx.update.message.reply_to_message.text[0].match(
        /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/
      )
    ) {
      return await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: ctx.update.message.chat.id,
          text: "唔好quote符號啦",
          reply_to_message_id: ctx.update.message.message_id,
        }
      );
    }
    const verb = isQuote
      ? ctx.update.message.reply_to_message.text.match(/^([A-Za-z]+)/) &&
        ctx.update.message.reply_to_message.text.match(/^([A-Za-z]+)/)[0]
        ? ctx.update.message.reply_to_message.text.match(/^([A-Za-z]+)/)[0]
        : ctx.update.message.reply_to_message.text[0]
      : "";
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text:
        Math.random() > 0.5
          ? isQuote
            ? verb
            : "98"
          : isQuote
          ? "唔" + verb
          : "不了",
      reply_to_message_id: ctx.update.message.message_id,
    });
  }

  async osakana(ctx) {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: "おさかな！！！ ＜＞＜",
    });
    await axios.post(`https://api.telegram.org/bot${token}/sendSticker`, {
      chat_id: ctx.update.message.chat.id,
      sticker:
        "CAACAgUAAxkBAAIKdmI8bTUmw8bce9LA0DI7zMgEPLjZAAKPBAACAznoV-vyS13KtrhpIwQ",
    });
  }

  async katsumoku(ctx) {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: "かつもく～かつもく～",
    });
    await axios.post(`https://api.telegram.org/bot${token}/sendAnimation`, {
      chat_id: ctx.update.message.chat.id,
      animation:
        "CgACAgUAAxkBAAIKk2I8dYR3-0tuOCnMB2RRL2xemmcHAAJNBAACQqCQVWMZ5BdroLb6IwQ",
    });
  }

  async jyakin(ctx) {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: "ジャキン！！",
    });
    await axios.post(`https://api.telegram.org/bot${token}/sendAnimation`, {
      chat_id: ctx.update.message.chat.id,
      animation:
        "CAACAgUAAxkBAAIK2mJFlaSEcLTn3-mTNUTI_OC-29V5AAICBAACgzDwVy7ZS0qjxbHZIwQ",
    });
  }

  async konkoyo(ctx) {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: "こんこよ～",
    });
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: "牙污～",
    });
    await axios.post(`https://api.telegram.org/bot${token}/sendSticker`, {
      chat_id: ctx.update.message.chat.id,
      sticker:
        "CAACAgUAAxkBAAIK0mJEpW1NQOm0z108rzsKIGb-u8XfAALEBgACD_45VdBwRGaIlXlDIwQ",
    });
  }

  async konnene(ctx) {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: "こんねね～",
    });
    await axios.post(`https://api.telegram.org/bot${token}/sendSticker`, {
      chat_id: ctx.update.message.chat.id,
      sticker:
        "CgACAgUAAxkBAAIK3mJFsHahb4jEUKIY2OHyDzJ1XMhcAAJ6BQACgsJpVqnLS-dEObRuIwQ",
    });
  }

  async desuwa(ctx) {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: "壱、十、百、千、満点サロメ♡",
    });
    await axios.post(`https://api.telegram.org/bot${token}/sendSticker`, {
      chat_id: ctx.update.message.chat.id,
      sticker:
        "CAACAgUAAxkBAAIMPWKiCkDtAvND3kuVGyAQ-2ktW5dTAAKwBQACI0b4VPsWTxI5L7YNJAQ",
    });
  }

  async herb(ctx) {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: "おハーブですわ⤴️",
    });
  }

  async fuck(ctx) {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: "おファックですわ⤴️",
    });
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
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: sentences[Math.floor(Math.random() * sentences.length)],
    });
  }
}

module.exports = ChatService;
