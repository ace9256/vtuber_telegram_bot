const TwitterWorker = require("./workers/twitterWorker");
const { chatList } = require("./list/chatList");
const { identities } = require("./env");

const setupTwitterPoller = () => {
  setTimeout(() => {
    twitterPoller();
    setInterval(async () => {
      await twitterPoller();
    }, 627429);
  }, getRoundedDate(1, new Date()) - new Date());
};

const twitterPoller = async () => {
  try {
    for (let chatId of chatList) {
      await new TwitterWorker(identities).getNewTweets(null, chatId);
    }
  } catch (e) {
    console.log(e);
  }
};

let getRoundedDate = (minutes, d = new Date()) => {
  let ms = 1000 * 60 * minutes; // convert minutes to ms
  let roundedDate = new Date(Math.ceil(d.getTime() / ms) * ms);

  return roundedDate;
};

module.exports = { setupTwitterPoller };
