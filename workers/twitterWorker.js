const axios = require("axios");
const { token } = require("../env");
const { twitterList } = require("../env");
const { isMidNight } = require("../helper/checkMidNight");
const { recovereLinks } = require("../helper/recovereLinks");
const { sendMessage } = require("../helper/telegramHelper");
const { format } = require("../helper/dateFormatter");

class TwitterWorker {
  constructor(identities) {
    this.identities = identities;
  }

  async getNewTweets(ctx, fallBackChatId = null) {
    const identitiesArray = Object.keys(this.identities);
    const randomIdentity =
      this.identities[
        identitiesArray[Math.floor(Math.random() * identitiesArray.length)]
      ];

    const { data: tweets } = await axios.get(
      `https://twitter.com/i/api/graphql/hhW2vKEEofWsP5bxXKB7Rg/ListLatestTweetsTimeline?variables=%7B%22listId%22%3A%22${twitterList}%22%2C%22count%22%3A20%7D&features=%7B%22blue_business_profile_image_shape_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22vibe_api_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Afalse%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Afalse%2C%22interactive_text_enabled%22%3Atrue%2C%22responsive_web_text_conversations_enabled%22%3Afalse%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`,
      {
        headers: {
          Authorization: randomIdentity.twitterAuthorization,
          "X-CSRF-Token": randomIdentity.twitterXCsrfToken,
          Cookie: randomIdentity.twitterCookie,
        },
      }
    );

    const chat_id = ctx?.update.message.chat.id;
    const finalChatId = chat_id || fallBackChatId;
    const lastRetrievedTweet = await this.getLastRetrievedTweet(finalChatId);

    let extractedTweets = this.extractTweets(tweets);
    if (extractedTweets === undefined) {
      if (ctx) {
        return await sendMessage(ctx, "Twitter又改野整壞左", {});
      }
      return;
    }

    if (
      extractedTweets[0].entryId.replace("tweet-", "") === lastRetrievedTweet
    ) {
      if (ctx) {
        return await sendMessage(ctx, "暫時沒有新tweet", {});
      }
      return;
    }

    extractedTweets = extractedTweets.filter(
      (tweet) =>
        tweet.entryId.startsWith("tweet-") ||
        tweet.entryId.startsWith("list-conversation-")
    );
    extractedTweets = extractedTweets
      .map((tweet) => this.processTweet(tweet))
      .flat();

    const sliceIndex = extractedTweets.findIndex(
      (tweet) => tweet.entryId.replace("tweet-", "") === lastRetrievedTweet
    );
    if (sliceIndex > 0) {
      extractedTweets = extractedTweets.slice(0, sliceIndex);
    }

    const lastestTweet = extractedTweets[0].entryId;

    extractedTweets.reverse();
    for (let t of extractedTweets) {
      if (t.retweetUrl) {
        await sendMessage(ctx, `${t.ownerName} Retweeted\n${t.retweetUrl}`, {
          chat_id: finalChatId,
        });
      } else {
        const recoveredLinks = await recovereLinks(t.fullText);
        await sendMessage(
          ctx,
          t.url +
            `\n${t.ownerName}\n\n${t.fullText}\n\n投稿時間: ${format(
              t.createdAt
            )}`,
          { chat_id: finalChatId }
        );
        if (recoveredLinks.length > 0) {
          sendMessage(ctx, recoveredLinks[0], {
            chat_id: finalChatId,
          });
        }
        if (t.media && t.media.length) {
          for (let currentMedia of t.media) {
            if (currentMedia.type === "photo") {
              await axios.post(
                `https://api.telegram.org/bot${token}/sendPhoto`,
                {
                  chat_id: finalChatId,
                  photo: currentMedia.url,
                }
              );
            } else if (currentMedia.type === "video") {
              await axios.post(
                `https://api.telegram.org/bot${token}/sendVideo`,
                {
                  chat_id: finalChatId,
                  video: currentMedia.url,
                }
              );
            }
          }
        }
      }
    }

    await this.updateLastRetrievedTweet(finalChatId, lastestTweet);
  }

  async getLastRetrievedTweet(chat_id, trial = 0) {
    try {
      const {
        data: { data: lastRetrievedTweet },
      } = await axios.get(
        `https://CtoTelegramBot.szetopak.repl.co/db/lastRetrievedTweet?chatId=${chat_id}`
      );

      return lastRetrievedTweet;
    } catch (e) {
      if (trial < 3) {
        return await this.getLastRetrievedTweet(chat_id, trial + 1);
      }
      throw e;
    }
  }

  async updateLastRetrievedTweet(chat_id, tweet, trial = 0) {
    try {
      await axios.put(
        `https://CtoTelegramBot.szetopak.repl.co/db/lastRetrievedTweet?chatId=${chat_id}&tweet=${tweet}`
      );
    } catch (e) {
      if (trial < 3) {
        await this.updateLastRetrievedTweet(chat_id, tweet, trial + 1);
      }
      throw e;
    }
  }

  extractTweets(tweets) {
    return tweets?.data?.list?.tweets_timeline?.timeline?.instructions?.find(
      (item) => item.type === "TimelineAddEntries"
    )?.entries;
  }

  // TODO: space(url.startsWith)
  processTweet(tweet) {
    if (tweet.entryId.startsWith("list-conversation-")) {
      return this.processListConversation(tweet);
    }

    const entryId = tweet.entryId.replace("tweet-", "");
    const userResults =
      tweet.content.itemContent.tweet_results.result.core.user_results.result;
    const ownerName = userResults?.legacy.name;
    const ownerScreenName = userResults?.legacy.screen_name;
    const tweetObject = tweet.content.itemContent.tweet_results.result.legacy;
    const fullText = tweetObject?.full_text;
    const createdAt = tweetObject?.created_at;

    let media = [];
    if (tweetObject?.extended_entities?.media) {
      media = this.extractMedia(tweetObject.extended_entities.media);
    }

    const retweet = tweetObject?.retweeted_status_result;
    let retweetUrlObj;
    if (retweet) {
      retweetUrlObj = this.extractRetweet(retweet);
    }

    return {
      entryId,
      url: `https://vxtwitter.com/${ownerScreenName}/status/${entryId}`,
      ownerName,
      fullText,
      createdAt,
      media,
      ...(retweetUrlObj || {}),
    };
  }

  processListConversation(tweet) {
    if (!tweet?.content?.items) {
      return [];
    }
    const listConversation = tweet.content.items;
    const reversedListConversation = listConversation
      .map((t) =>
        this.processTweet({
          entryId: t.entryId.match(/tweet-\d+$/)[0],
          content: t.item,
        })
      )
      .reverse();
    return reversedListConversation;
  }

  extractMedia(media) {
    return media
      .filter((m) => m.type === "photo" || m.type === "video")
      .map((m) => {
        if (m.type === "photo") {
          return { type: "photo", url: m.media_url_https };
        }
        return { type: "video", url: m.video_info.variants[0].url };
      });
  }

  extractRetweet(retweet) {
    const retweetId = retweet.result.rest_id;
    const retweetOwnerScreenName =
      retweet.result.core.user_results.result.legacy.screen_name;
    return {
      retweetUrl: `https://vxtwitter.com/${retweetOwnerScreenName}/status/${retweetId}`,
    };
  }
}

module.exports = TwitterWorker;
