const axios = require("axios");
const { Extra, Markup } = require("telegraf");
const { recommandChoices } = require("../list/actions");
const { holodexApiKey } = require("../env");
const { channelList } = require("../list/channelList");
const { token } = require("../env");
const { format2 } = require("../helper/dateFormatter");

class HolodexService {
  constructor() {}

  async getChannels(ctx) {
    const response = await axios.get(
      "https://holodex.net/api/v2/channels?org=Hololive&limit=100",
      {
        headers: { "X-APIKEY": holodexApiKey },
      }
    );
    const channels = response.data
      .map((el) => ({ id: el.id, name: el.name, org: el.org, group: el.group }))
      .filter(
        (el) =>
          el.group !== null &&
          !el.group.includes("Holostars") &&
          !el.group.includes("INACTIVE") &&
          !el.name.includes("holostars") &&
          el.group === "GAMERS"
      );
    console.log(channels.length);
    console.log(channels);
  }

  async getStreams() {
    const channelIds = channelList.map((el) => el.id).join(",");
    const { data } = await axios.get(
      `https://holodex.net/api/v2/users/live?channels=${channelIds}`
    );
    return data;
  }

  async getCurrentStreams(ctx) {
    const data = (await this.getStreams()).filter((el) => el.status === "live");
    let resultArr = [];
    const limit = 10;
    for (let idx in data) {
      if (parseInt(idx) % limit === 0) {
        var result = `${
          data.length
            ? `\n\n配信資訊 #${Math.floor(idx / limit) + 1}: `
            : "現在沒有配信"
        }`;
      }
      result += `\n\n配信者: ${data[idx].channel.name}\n主題: ${data[idx].title}\n連結: https://youtu.be/${data[idx].id}`;
      if (
        parseInt(idx) % limit === limit - 1 ||
        parseInt(idx) === data.length - 1
      ) {
        resultArr.push(result);
      }
    }
    for (let result of resultArr) {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: ctx.update.message.chat.id,
        text: result,
        reply_to_message_id: ctx.update.message.message_id,
        disable_web_page_preview: true,
      });
    }
  }

  async recommand(ctx) {
    const inlineMessageRatingKeyboard = Markup.inlineKeyboard(recommandChoices);
    ctx.telegram.sendMessage(
      ctx.update.message.chat.id,
      "想搵啲咩?",
      inlineMessageRatingKeyboard
    );
  }

  async recommandPart2(include, ctx) {
    ctx.editMessageReplyMarkup();
    const params = include
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (str) {
        return str.toUpperCase();
      })
      .split(" ");
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.callback_query.message.chat.id,
      text: `已選擇 ${
        recommandChoices.filter((c) => c[0].callback_data === include)[0][0]
          .text
      }`,
      reply_to_message_id: ctx.update.callback_query.message.message_id,
      disable_web_page_preview: true,
    });
    const { data } = await axios.get(
      `https://holodex.net/api/v2/live?topic=${params[0].toLowerCase()}${
        params[1] === "Future"
          ? "&max_upcoming_hours=1&status=upcoming"
          : "&status=live"
      }`,
      {
        headers: { "X-APIKEY": holodexApiKey },
      }
    );
    const result = data
      .map(
        (d) => d.title + "\n" + d.channel?.name + "\n" + `https://www.youtube.com/watch?v=${d.id}` + "\n"
      )
      .join("\n");
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.callback_query.message.chat.id,
      text: data.length === 0 ? "暫時找不到相關直播" : result,
      reply_to_message_id: ctx.update.callback_query.message.message_id,
      disable_web_page_preview: true,
    });
  }
  async singingNow(ctx) {
    this.recommandPart2(arguments["0"]["match"][0], ctx);
  }
  async asmrNow(ctx) {
    this.recommandPart2(arguments["0"]["match"][0], ctx);
  }
  async singingFuture(ctx) {
    this.recommandPart2(arguments["0"]["match"][0], ctx);
  }
  async asmrFuture(ctx) {
    this.recommandPart2(arguments["0"]["match"][0], ctx);
  }
}

module.exports = HolodexService;
