//http_method command service method
const routes = [
  //utilController
  "get / utilController pingHandler",
  "get /proxy utilController proxy",
  //twitterController
  "post /new_tweet twitterController newTweetHandler",
  "post /new_tweet_schedule twitterController newTweetScheduleHandler",
  "post /new_tweet2 twitterController newTweetHandler2",
  //holodexController
  "get /get_twitch_lives holodexController getTwitchLives",
];

module.exports = { routes };
