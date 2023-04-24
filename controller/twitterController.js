const axios = require("axios");
const TwitterService = require("../service/twitterService");
const { format } = require("../helper/dateFormatter");
const { token } = require("../env");
const { chatList } = require("../list/chatList");

class TwitterController {
  constructor() {
    this.twitterService = new TwitterService();
  }

  async newTweetHandler(req, res) {
    console.log(req.body, new Date());
    res.json({ ping: true });
    const { username, userScreenName, tweetId, text, created_at, media } =
      req.body;
    await this.twitterService.newTweetHandler(
      username,
      userScreenName,
      tweetId,
      text,
      created_at,
      media
    );
  }

  async newTweetHandler2(req, res) {
    console.log(req.body, new Date());
    res.json({ ping: true });
    const { username, userScreenName, tweetId, text, created_at, media } =
      req.body;
    await this.twitterService.newTweetHandler2(
      username,
      userScreenName,
      tweetId,
      text,
      created_at,
      media
    );
  }

  async newTweetScheduleHandler(req, res) {
    console.log(req.body, new Date());
    res.json({ ping: true });
    const { text, media } = req.body;
    await this.twitterService.newTweetScheduleHandler(text, media);
  }
}

module.exports = TwitterController;
