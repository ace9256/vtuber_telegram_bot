const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { token } = require("../env");
const { sendMessage } = require("../helper/telegramHelper");

class HolocureService {
  constructor() {}

  async getHolocure(ctx) {
    const { data } = await axios.get("https://kay-yu.itch.io/holocure");
    const { document } = new JSDOM(data).window;
    const attr = document.querySelector(".button.download_btn").attributes;
    const uploadId = Object.values(attr).reduce((memo, item) => {
      if (item.name === "data-upload_id") return item.value;
      return memo;
    }, "");
    const {
      data: { url },
    } = await axios.post(
      `https://kay-yu.itch.io/holocure/file/${uploadId}?source=view_game&as_props=1&after_download_lightbox=true`
    );
    await sendMessage(
      ctx,
      `Home Page: https://kay-yu.itch.io/holocure\nDownload Link: ${url}`
    );
  }
}

module.exports = HolocureService;
