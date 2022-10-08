const axios = require("axios");
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
}

module.exports = HolodexService;
