const axios = require("axios");
const { format, format2 } = require("../helper/dateFormatter");
const { token } = require("../env");
const { identities } = require("../env");
const { chatList } = require("../list/chatList");
const { isMidNight } = require("../helper/checkMidNight");
const { recovereLinks } = require("../helper/recovereLinks");
const { channelList } = require("../list/channelList");
const HolodexService = require("./holodexService");
const TwitterWorker = require("../workers/twitterWorker");

class TwitterService {
  constructor() {
    this.holodexService = new HolodexService();
    this.twitterWorker = new TwitterWorker(identities);
  }
//   Deprecated
//   async newTweetHandler(
//     username,
//     userScreenName,
//     tweetId,
//     text,
//     created_at,
//     media
//   ) {
//     const url = `https://twitter.com/${userScreenName}/status/${tweetId}`;
//     const recoveredLinks = await recovereLinks(text);
//     for (let chatId of chatList) {
//       if (userScreenName === "holo_space_bot") {
//         await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
//           chat_id: chatId,
//           text: `https://${text.split("https://")[1]}\nSpace: ${
//             text.split(" さんがスペースを開始しました")[0]
//           }\n開始時間: ${format(created_at)}`,
//           disable_web_page_preview: false,
//           disable_notification: isMidNight,
//         });
//       } else {
//         const result = await axios.post(
//           `https://api.telegram.org/bot${token}/sendMessage`,
//           {
//             chat_id: chatId,
//             text:
//               url.replace("https://twitter.com/", "https://vxtwitter.com/") +
//               `\n${username}\n\n${text}\n\n投稿時間: ${format(created_at)}`,
//             disable_web_page_preview: false,
//             disable_notification: isMidNight,
//           }
//         );
//         if (recoveredLinks.length > 0) {
//           await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
//             chat_id: chatId,
//             text: recoveredLinks[0],
//             disable_web_page_preview: false,
//             disable_notification: isMidNight,
//             reply_to_message_id: result.data.result.message_id,
//           });
//         }
//         if (media && media.length) {
//           for (let currentMedia of media) {
//             await axios.post(`https://api.telegram.org/bot${token}/sendPhoto`, {
//               chat_id: chatId,
//               photo: currentMedia["media_url"],
//               disable_notification: isMidNight,
//               reply_to_message_id: result.data.result.message_id,
//             });
//           }
//         }
//       }
//     }
//   }

  async newTweetScheduleHandler(text, media) {
    if (text.includes("ホロジュールが更新されました")) {
      for (let chatId of chatList) {
        if (media && media[0]) {
          const membersOnlyStreams = (
            await this.holodexService.getStreams()
          ).filter((el) => el.topic_id === "membersonly");
          let extendedCaption = `${
            membersOnlyStreams.length ? "\n\n會限資訊: " : ""
          }`;
          for (let membersOnlyStream of membersOnlyStreams) {
            extendedCaption += `\n\n配信者: ${
              membersOnlyStream.channel.name
            }\n主題: ${membersOnlyStream.title}\n開始時間: ${format2(
              membersOnlyStream.available_at
            )}\n狀態: ${membersOnlyStream.status}\n連結: https://youtu.be/${
              membersOnlyStream.id
            }`;
          }
          const result = await axios.post(
            `https://api.telegram.org/bot${token}/sendPhoto`,
            {
              chat_id: chatId,
              photo: media[1] ? media[1]["media_url"] : media[0]["media_url"],
              disable_notification: isMidNight,
              caption: `時間表更新 (時間全部為日本時間)${extendedCaption}`,
            }
          );
          const chat = await axios.get(
            `https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`
          );
          await axios.post(
            `https://api.telegram.org/bot${token}/unpinAllChatMessages`,
            {
              chat_id: chatId,
            }
          );
          if (chat.data.result.pinned_message) {
            await axios.post(
              `https://api.telegram.org/bot${token}/deleteMessage`,
              {
                chat_id: chatId,
                message_id: parseInt(
                  chat.data.result.pinned_message.message_id
                ),
              }
            );
          }
          await axios.post(
            `https://api.telegram.org/bot${token}/pinChatMessage`,
            {
              chat_id: chatId,
              message_id: result.data.result.message_id,
              disable_notification: isMidNight,
            }
          );
        }
      }
    }
  }
  
  async checkTwitter(ctx) {
    await this.twitterWorker.getNewTweets(ctx)
  }
}

module.exports = TwitterService;
