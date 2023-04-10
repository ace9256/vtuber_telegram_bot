const { sendMessage } = require("../helper/telegramHelper");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const acorn = require("acorn");

class ShopifyService {
  constructor() {}

  async getQuantity(ctx) {
    const url = ctx.update.message.reply_to_message.text;
    const response = await axios.get(url);
    let html = response.data;
    html = html.match(/<!-- BEGIN app snippet: product -->(.*?)<\/script>/s);
    const dom = new JSDOM(html, { parsingMode: "html" });
    const scriptContent =
      dom.window.document.querySelector("script").textContent;
    const elspwMatch = scriptContent.match(/Elspw.params.product = (.*);/);
    if (elspwMatch) {
      const product = JSON.parse(elspwMatch[1]);
      const variants = product.variants;
      await sendMessage(
        ctx,
        variants.reduce(
          (prev, curr) =>
            prev + "商品: " + curr.title + "\n" + "數量: " + curr.qty + "\n\n",
          ""
        ),
        {
          reply: ctx.update.message.reply_to_message,
        }
      );
    } else {
      await sendMessage(ctx, "你提供的網址可能不正確", {
        reply: ctx.update.message.reply_to_message,
      });
    }
  }
}

module.exports = ShopifyService;
