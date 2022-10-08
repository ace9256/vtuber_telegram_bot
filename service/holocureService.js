const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { token } = require("../env");

class HolocureService {
  constructor() {}

  async getHolocure(ctx) {
    const { data } = await axios.get("https://kay-yu.itch.io/holocure");
    const { document } = new JSDOM(data).window;
    const attr = document.querySelector(".button.download_btn").attributes;
    let uploadId = "";
    for (let i = 0; i < attr.length; i++) {
      if (
        document.querySelector(".button.download_btn").attributes[i].name ===
        "data-upload_id"
      ) {
        uploadId = document.querySelector(".button.download_btn").attributes[i]
          .value;
      }
    }
    const buttonLink = `https://kay-yu.itch.io/holocure/file/${uploadId}?source=view_game&as_props=1&after_download_lightbox=true`;
    const url = (await axios.post(buttonLink)).data.url;
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: `Home Page: https://kay-yu.itch.io/holocure\nDownload Link: ${url}`,
    });
  }
}

module.exports = HolocureService;
