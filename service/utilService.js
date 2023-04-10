const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { token, ocrApiKey } = require("../env");
const { isMidNight } = require("../helper/checkMidNight");
const { helpText } = require("../message/helpText");
const { startText } = require("../message/startText");
const { spectatingLists } = require("../list/spectatingLists");
const { stickersList } = require("../list/stickersList");
const {
  downloadYoutubeStickersHelper,
} = require("../helper/downloadYoutubeStickers");
const { dateIsValid } = require("../helper/dateIsValid");
const {
  sendMessage,
  getFile,
  getFileUrl,
} = require("../helper/telegramHelper");

class UtilService {
  constructor() {}

  start(ctx) {
    console.log(startText);
    ctx.reply(startText);
  }

  help(ctx) {
    ctx.reply(helpText);
  }

  async chatDetails(ctx) {
    const response = await axios.get(
      `https://api.telegram.org/bot${token}/getUpdates`
    );
    console.log(response.data.result[0].message);
    ctx.reply(response.data.result[0].message.chat.id);
  }

  async checkSC(ctx) {
    const youtubeID = this.getYoutubeID(ctx);
    if (youtubeID) {
      const groups = ["youtube", "kojin", "2j3j", "vspo", "noripro", "aogiri"];
      const types = ["archive", "realtime"];
      for (let group of groups) {
        for (let type of types) {
          const result = await this.getHololyzerData(
            youtubeID,
            group,
            type,
            "superchat"
          );
          if (result) {
            return await this.resHololyzerSCData(ctx, result);
          }
        }
      }
      await await sendMessage(ctx, "暫不支援此影片", {
        reply: ctx.update.message.reply_to_message,
      });
    }
  }

  async checkChat(ctx) {
    const youtubeID = this.getYoutubeID(ctx);
    if (youtubeID) {
      const groups = ["youtube", "kojin", "2j3j", "vspo", "noripro", "aogiri"];
      const types = ["archive", "realtime"];
      for (let group of groups) {
        for (let type of types) {
          const result = await this.getHololyzerData(
            youtubeID,
            group,
            type,
            "supana"
          );
          if (result) {
            return await this.resHololyzerChatData(ctx, result);
          }
        }
      }
      await await sendMessage(ctx, "暫不支援此影片", {
        reply: ctx.update.message.reply_to_message,
      });
    }
  }

  async checkViewers(ctx) {
    const youtubeID = this.getYoutubeID(ctx);
    if (youtubeID) {
      const result = await axios.get(
        `https://www.youtube.com/watch?v=${youtubeID}`
      );
      let regex = /\[{"text":"\d.*?"},{"text":" watching now"}\]/;
      await await sendMessage(
        ctx,
        regex.exec(result.data)
          ? `${eval(regex.exec(result.data)[0])[0].text} 人正在觀看`
          : "此影片並非直播/ 會限直播無法查閱觀看人數",
        {
          reply: ctx.update.message.reply_to_message,
        }
      );
    }
  }

  getYoutubeID(ctx) {
    const replyToMessage = ctx.update.message.reply_to_message;
    if (!replyToMessage) {
      ctx.reply("你冇quote youtube link呀");
      return null;
    } else if (
      !replyToMessage.text.includes("https://www.youtube.com/watch?v=") &&
      !replyToMessage.text.includes("https://www.youtube.com/live/") &&
      !replyToMessage.text.includes("https://youtu.be/")
    ) {
      ctx.reply("你唔係quote緊 youtube link呀");
      return null;
    }
    if (replyToMessage.text.includes("https://www.youtube.com/watch?v=")) {
      var youtubeID = replyToMessage.text.split(
        "https://www.youtube.com/watch?v="
      )[1];
    } else if (replyToMessage.text.includes("https://www.youtube.com/live/")) {
      var youtubeID = replyToMessage.text
        .split("https://www.youtube.com/live/")[1]
        .split("?")[0];
    } else {
      var youtubeID = replyToMessage.text.split("https://youtu.be/")[1];
    }
    return youtubeID.split("&")[0];
  }

  async getHololyzerData(youtubeID, group, status, type) {
    const result = await axios.get(
      `https://www.hololyzer.net/${group}/${status}/${type}/${youtubeID}.html`,
      {
        validateStatus: (status) => status < 500,
      }
    );
    return result.status === 404 ? false : result;
  }

  async resHololyzerSCData(ctx, result) {
    try {
      const { document } = new JSDOM(
        `<table>\n<tr>\n${
          result.data.match(
            /(<td class='supacha_td'>.*?<\/td>)\n<\/tr>\n<\/table>/
          )[1]
        }`
      ).window;

      const supachaTds = document.querySelectorAll(".supacha_td");
      const totalAmountTd = supachaTds[supachaTds.length - 1];
      const totalAmount = parseInt(
        totalAmountTd.innerHTML.replace(/\\|,/g, "")
      );
      await sendMessage(
        ctx,
        `SC: ${
          totalAmount !== NaN ? totalAmount.toLocaleString("en-US") : 0
        }円\n截至: ${new Date().toLocaleString("zh-TW", {
          timeZone: "Asia/Taipei",
        })}`,
        {
          reply: ctx.update.message.reply_to_message,
        }
      );
    } catch {
      return await sendMessage(
        ctx,
        `SC: ${0}円\n截至: ${new Date().toLocaleString("zh-TW", {
          timeZone: "Asia/Taipei",
        })}`,
        {
          reply: ctx.update.message.reply_to_message,
        }
      );
    }
  }

  async resHololyzerChatData(ctx, result) {
    let chatArr = [...result.data.matchAll(/<td(?: width=200>|>)(.*?)<\/td>/g)]
      .map((match) => match[1])
      .slice(2)
      .reduce((prev, curr, ind) => {
        if (ind % 2 === 0) {
          prev.unshift(`${curr}: `);
        } else {
          prev[0] += curr;
        }
        return prev;
      }, [])
      .reverse();
    await sendMessage(
      ctx,
      chatArr.length
        ? chatArr
            .join("\n\n")
            .replaceAll(/<img\s(.*emoji_u)(.*)(.svg) \/>/g, (_, __, capture) =>
              String.fromCodePoint(parseInt(`0x${capture}`, 16))
            )
            .replaceAll(/(<img.*?\/>)/g, "[貼圖]")
        : "暫無ホロメン留言",
      {
        reply: ctx.update.message.reply_to_message,
      }
    );
  }

  async setAlarm(ctx, addedDays = 0) {
    const message_id = ctx.update.message.message_id;
    const chat_id = ctx.update.message.chat.id;
    const from = ctx.update.message.from.id;
    const text = ctx.update.message.text.includes("[")
      ? "[" + ctx.update.message.text.split("[")[1].split("]")[0] + "]"
      : null;
    const params = text
      ? ctx.update.message.text.split("[")[0].trim().split(/\s+/)
      : ctx.update.message.text.split(/\s+/);
    if (params.length <= 1) {
      const {
        data: { data },
      } = await axios.get(
        `https://CtoTelegramBot.szetopak.repl.co/db/timeReminder?chatId=${chat_id}&from=${from}`
      );
      if (!data) {
        return await axios.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id: ctx.update.message.chat.id,
            text: data === undefined ? "暫無設置alarm" : "個野壞左拎唔到資料",
            reply_to_message_id: ctx.update.message.message_id,
          }
        );
      } else {
        let replyMessage = "";
        let idx = 0;
        for (let item of data) {
          replyMessage += `${++idx}. ${item.year}年${item.month + 1}月${
            item.date
          }日${item.hour}時${item.min}分: ${item.text}\n`;
        }
        return await axios.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id: ctx.update.message.chat.id,
            text: replyMessage === "" ? "暫無設置alarm" : replyMessage,
            reply_to_message_id: ctx.update.message.message_id,
          }
        );
      }
    }
    params.shift();
    if (text) {
      params.push(text);
    }
    console.log(params);
    let input = {
      date: new Date(
        new Date().setHours(new Date().getHours() + 8 + 24 * addedDays)
      ).getDate(),
      month: new Date(
        new Date().setHours(new Date().getHours() + 8)
      ).getMonth(),
      year: new Date(
        new Date().setHours(new Date().getHours() + 8)
      ).getFullYear(),
      text: "提你",
    };
    for (let idx in params) {
      if (params[idx].match(/^\d\d\d\d$/)) {
        params[idx] =
          params[idx].substring(0, 2) + ":" + params[idx].substring(2, 4);
      }
      params[idx] = this.dateOrTime(params[idx]);
      input = { ...input, ...params[idx] };
    }
    if (!input.hour && !input.min) {
      return await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: ctx.update.message.chat.id,
          text: "想幾時?",
          reply_to_message_id: ctx.update.message.message_id,
        }
      );
    }
    const body = { input: { ...input, message_id }, chat_id, from };
    if (
      new Date(
        input.year,
        input.month,
        input.date,
        input.hour - 8,
        input.min
      ) <= new Date()
    ) {
      return this.setAlarm(ctx, 1);
    }
    const {
      data: { db },
    } = await axios.post(
      "https://CtoTelegramBot.szetopak.repl.co/db/timeReminder",
      body
    );
    if (db) {
      return await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: ctx.update.message.chat.id,
          text: "收到",
          reply_to_message_id: ctx.update.message.message_id,
        }
      );
    } else {
      return await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: ctx.update.message.chat.id,
          text: "個野壞左set唔到",
          reply_to_message_id: ctx.update.message.message_id,
        }
      );
    }
  }

  dateOrTime(str) {
    if (str[0] === "[" && str[str.length - 1] === "]") {
      return {
        text: str.substring(1, str.length - 1),
      };
    }
    if (
      str.includes("/") &&
      ((str.match(/\//g) || []).length == 2
        ? dateIsValid(str)
        : dateIsValid(
            str +
              `/${new Date(
                new Date().setHours(new Date().getHours() + 8)
              ).getFullYear()}`
          ))
    ) {
      const arr = str.split("/");
      return {
        date: arr[0],
        month: arr[1] - 1,
        year: arr[2] || new Date().getFullYear(),
      };
    } else if (str.includes(":")) {
      const arr = str.split(":");
      return {
        hour: arr[0],
        min: arr[1],
      };
    } else {
      return {
        text: str,
      };
    }
  }

  async delAlarm(ctx) {
    const message_id = ctx.update.message.message_id;
    const chat_id = ctx.update.message.chat.id;
    const from = ctx.update.message.from.id;
    const params = ctx.update.message.text.split(/\s+/);
    if (params.length <= 1) {
      const {
        data: { db },
      } = await axios.delete(
        `https://CtoTelegramBot.szetopak.repl.co/db/timeReminder`,
        {
          data: {
            chat_id,
            from,
            target: "all",
          },
        }
      );
      if (!db) {
        return await axios.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id: ctx.update.message.chat.id,
            text: "個野壞左del唔到",
            reply_to_message_id: ctx.update.message.message_id,
          }
        );
      } else {
        return await axios.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id: ctx.update.message.chat.id,
            text: "已del",
            reply_to_message_id: ctx.update.message.message_id,
          }
        );
      }
    } else if (params.length >= 3) {
      return await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: ctx.update.message.chat.id,
          text: "一係唔入, 一係一次入一個Number",
          reply_to_message_id: ctx.update.message.message_id,
        }
      );
    }
    const {
      data: { db },
    } = await axios.delete(
      `https://CtoTelegramBot.szetopak.repl.co/db/timeReminder`,
      {
        data: {
          chat_id,
          from,
          target: params[1],
        },
      }
    );
    if (!db) {
      return await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: ctx.update.message.chat.id,
          text: "個野壞左del唔到",
          reply_to_message_id: ctx.update.message.message_id,
        }
      );
    } else {
      return await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: ctx.update.message.chat.id,
          text: "已del",
          reply_to_message_id: ctx.update.message.message_id,
        }
      );
    }
  }

  async executeAlarm() {
    const {
      data: { data },
    } = await axios.get(
      `https://CtoTelegramBot.szetopak.repl.co/db/timeReminder?chatId=all&from=`
    );
    for (let chat of data) {
      for (let chat_id in chat) {
        for (let from in chat[chat_id]) {
          if (from === "memo") {
            continue;
          }
          for (let i = chat[chat_id][from].length - 1; i >= 0; i--) {
            let alarm = chat[chat_id][from][i];
            if (
              new Date(
                alarm.year,
                alarm.month,
                alarm.date,
                alarm.hour - 8,
                alarm.min
              ) -
                new Date() <=
              5000
            ) {
              await axios.post(
                `https://api.telegram.org/bot${token}/sendMessage`,
                {
                  chat_id: chat_id,
                  text: alarm.text,
                  reply_to_message_id: alarm.message_id,
                }
              );
              await axios.delete(
                `https://CtoTelegramBot.szetopak.repl.co/db/timeReminder`,
                {
                  data: {
                    chat_id,
                    from,
                    target: i + 1,
                  },
                }
              );
            }
          }
        }
      }
    }
  }

  async checkSpectatingLists(ctx) {
    let str = "";
    for (let spectatingListKey in spectatingLists) {
      str += spectatingListKey + ": [\n";
      for (let acc of spectatingLists[spectatingListKey]) {
        str += "  " + acc + ",\n";
      }
      str += "]\n";
    }
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: str,
      reply_to_message_id: ctx.update.message.message_id,
    });
  }

  async downloadYoutubeStickers(ctx) {
    const params = ctx.update.message.text.split(/\s+/)[1];
    const result = await downloadYoutubeStickersHelper(params);
    while (result.length > 0) {
      await axios.post(`https://api.telegram.org/bot${token}/sendDocument`, {
        chat_id: ctx.update.message.chat.id,
        document: result.splice(0, 1)[0],
        reply_to_message_id: ctx.update.message.message_id,
      });
    }
  }

  async translate(ctx) {
    if (!ctx.update.message.reply_to_message) {
      const params = ctx.update.message.text.split(/\s+/);
      params.shift();
      if (params.length == 0) {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
          chat_id: ctx.update.message.chat.id,
          text: "唔知你想翻譯啲乜",
          reply_to_message_id: ctx.update.message.message_id,
        });
      } else {
        const { data } = await axios.get(
          `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=zh_TW&q=${encodeURIComponent(
            params.join(" ")
          )}`
        );
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
          chat_id: ctx.update.message.chat.id,
          text: data.flat()[0],
          reply_to_message_id: ctx.update.message.message_id,
        });
      }
      return;
    } else {
      const { data } = await axios.get(
        `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=zh_TW&q=${encodeURIComponent(
          ctx.update.message.reply_to_message.text
        )}`
      );
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: ctx.update.message.chat.id,
        text: data.flat()[0],
        reply_to_message_id: ctx.update.message.message_id,
      });
    }
  }

  async checkStickersList(ctx) {
    let str = stickersList.join("\n");
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ctx.update.message.chat.id,
      text: str,
      reply_to_message_id: ctx.update.message.message_id,
    });
  }

  async calculate(ctx) {
    const statement = ctx.update.message.text.substring(5).replace(/ /g, "");
    const regex = new RegExp("[^\\d+\\-*\\/()\\^]", "g");
    let isInvalid;
    isInvalid = regex.test(statement);
    let answer;
    try {
      if (!isInvalid) {
        answer = eval(statement);
      }
    } catch (e) {
      isInvalid = true;
    }
    if (isInvalid || statement === "") {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: ctx.update.message.chat.id,
        text: "唔知你想計乜",
        reply_to_message_id: ctx.update.message.message_id,
      });
    } else {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: ctx.update.message.chat.id,
        text: answer,
        reply_to_message_id: ctx.update.message.message_id,
      });
    }
  }

  async memo(ctx) {
    const input = ctx.update.message.reply_to_message
      ? ctx.update.message.reply_to_message.text
      : undefined;
    const chat_id = ctx.update.message.chat.id;
    if (input) {
      const body = { input, chat_id };
      const {
        data: { db },
      } = await axios.post(
        "https://CtoTelegramBot.szetopak.repl.co/db/memo",
        body
      );
      if (db) {
        return await axios.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id,
            text: "Pinned",
            reply_to_message_id: ctx.update.message.message_id,
          }
        );
      } else {
        return await axios.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id,
            text: "個野壞左pin唔到",
            reply_to_message_id: ctx.update.message.message_id,
          }
        );
      }
    } else {
      const {
        data: { data },
      } = await axios.get(
        `https://CtoTelegramBot.szetopak.repl.co/db/memo?chatId=${chat_id}`
      );
      if (data) {
        let ans = "";
        for (let i = 0; i < data.length; i++) {
          ans += `${i + 1}: ${data[i]}\n`;
        }
        return await axios.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id,
            text: ans,
            reply_to_message_id: ctx.update.message.message_id,
          }
        );
      } else {
        return await axios.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id,
            text: "暫時冇野pin緊",
            reply_to_message_id: ctx.update.message.message_id,
          }
        );
      }
    }
  }

  async delMemo(ctx) {
    const message_id = ctx.update.message.message_id;
    const chat_id = ctx.update.message.chat.id;
    const params = ctx.update.message.text.split(/\s+/);
    if (params.length <= 1) {
      const {
        data: { db },
      } = await axios.delete(
        `https://CtoTelegramBot.szetopak.repl.co/db/memo`,
        {
          data: {
            chat_id,
            target: "all",
          },
        }
      );
      if (!db) {
        return await axios.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id: ctx.update.message.chat.id,
            text: "個野壞左del唔到",
            reply_to_message_id: message_id,
          }
        );
      } else {
        return await axios.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id: ctx.update.message.chat.id,
            text: "已del",
            reply_to_message_id: message_id,
          }
        );
      }
    } else if (params.length >= 3) {
      return await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: ctx.update.message.chat.id,
          text: "一係唔入, 一係一次入一個Number",
          reply_to_message_id: message_id,
        }
      );
    }
    const {
      data: { db },
    } = await axios.delete(`https://CtoTelegramBot.szetopak.repl.co/db/memo`, {
      data: {
        chat_id,
        target: params[1],
      },
    });
    if (!db) {
      return await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: ctx.update.message.chat.id,
          text: "個野壞左del唔到",
          reply_to_message_id: message_id,
        }
      );
    } else {
      return await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: ctx.update.message.chat.id,
          text: "已del",
          reply_to_message_id: message_id,
        }
      );
    }
  }

  async crime(ctx) {
    ctx.reply(`你叫左屋企唔好煮你飯先啦`);
  }

  async random(ctx) {
    const args = ctx.match.input.split(" ");
    if (args.length === 1) {
      return sendMessage(ctx, `想抽d咩?`, {
        reply: ctx.update.message.reply_to_message,
      });
    }
    args.shift();
    return sendMessage(ctx, args[Math.floor(Math.random() * args.length)], {
      reply: ctx.update.message.reply_to_message,
    });
  }

  async ocr(ctx) {
    // check server status
    const { data: statusRes } = await axios.get("https://status.ocr.space/");
    const { document } = new JSDOM(statusRes).window;
    const status = document.querySelector(".status").innerHTML;
    if (status === " DOWN ") {
      await sendMessage(
        ctx,
        "個圖像識別server好似down down地, 如果唔得就過一陣再試啦",
        {
          reply: ctx.update.message.reply_to_message,
        }
      );
    }

    // main logic
    const args = ctx.match.input.split(" ");
    if (args.length === 1) {
      return sendMessage(
        ctx,
        `想認咩語言, 麻煩加番係後面\nChinese(Traditional) = cht\nEnglish = eng\nKorean = kor\nJapanese = jpn`,
        {
          reply: ctx.update.message.reply_to_message,
        }
      );
    }

    if (!ctx.update.message.reply_to_message) {
      return sendMessage(ctx, `你想認d咩, 要quote, 圖又得, Link又得`, {
        reply: ctx.update.message.reply_to_message,
      });
    }

    const photo = ctx.update.message.reply_to_message.photo;
    if (photo) {
      const filePath = (await getFile(photo?.pop().file_id)).result.file_path;
      var url = getFileUrl(filePath);
    }

    const text = ctx.update.message.reply_to_message.text;
    if (text) {
      var url = text;
    }

    const ext = args[2] || url.match(/(PDF|GIF|PNG|JPG|TIF|BMP)/i)?.[0];
    const { data } = await axios.get(
      `https://api.ocr.space/parse/imageurl?apikey=${ocrApiKey}&url=${encodeURIComponent(
        url
      )}&filetype=${ext}&language=${args[1]}&OCREngine=3&scale=true`
    );
    if (!data.ParsedResults?.[0].ParsedText) {
      return await sendMessage(ctx, "投降, 認唔到", {
        reply: ctx.update.message.reply_to_message,
      });
    }
    await sendMessage(ctx, data.ParsedResults?.[0].ParsedText, {
      reply: ctx.update.message.reply_to_message,
    });
  }
}

module.exports = UtilService;
