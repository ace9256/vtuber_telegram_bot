const axios = require("axios");
const { token } = require("../env");

const sendSticker = async (ctx, stickerId, options = {}) => {
  await axios.post(`https://api.telegram.org/bot${token}/sendSticker`, {
    chat_id: ctx?.update.message.chat.id || options.chat_id,
    sticker: stickerId,
    ...(options.reply
      ? {
          reply_to_message_id: ctx?.update.message.reply_to_message
            ? ctx.update.message.reply_to_message.message_id
            : "",
        }
      : {}),
  });
};

const sendMessage = async (ctx, text, options = {}) => {
  await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: ctx?.update.message.chat.id || options.chat_id,
    text: text,
    ...(options.reply
      ? {
          reply_to_message_id: ctx?.update.message.reply_to_message
            ? ctx.update.message.reply_to_message.message_id
            : "",
        }
      : {}),
    ...(options.parse_mode
      ? {
          parse_mode: options.parse_mode,
        }
      : {}),
  });
};

const getFile = async (fileId) => {
  return (
    await axios.get(
      `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
    )
  ).data;
};

const getFileUrl = (filePath) =>
  `https://api.telegram.org/file/bot${token}/${filePath}`;

module.exports = { sendSticker, sendMessage, getFile, getFileUrl };
