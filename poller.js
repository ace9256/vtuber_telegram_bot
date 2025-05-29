const TwitterWorker = require("./workers/twitterWorker");
const PingWorker = require("./workers/pingWorker")
const { chatList } = require("./list/chatList");
const { identities } = require("./env");

const getRoundedDate = (minutes, d = new Date()) => {
  const ms = 1000 * 60 * minutes; // convert minutes to ms
  return new Date(Math.ceil(d.getTime() / ms) * ms);
};

const pollTimelag = getRoundedDate(1, new Date()) - new Date();

const setupPoller = () => {
  setTimeout(() => {
    poller();
    setInterval(async () => {
      await poller();
    }, 209143);
  }, pollTimelag);
};

const poller = async () => {
  await pingPoller();
      await twitterPoller();
}

const twitterPoller = async () => {
  try {
    for (let chatId of chatList) {
      await new TwitterWorker(identities).getNewTweets(null, chatId);
    }
  } catch (e) {
    console.log(e);
  }
};

const pingPoller = async () => {
    try {
    for (let chatId of chatList) {
      await new PingWorker().ping();
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = { setupPoller };
