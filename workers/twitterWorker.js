const axios = require("axios");
const {
  token,
  TweetsMessageThreadId,
  twitterList,
  replitDbDomain,
} = require("../env");
const { isMidNight } = require("../helper/checkMidNight");
const { recoverLinks } = require("../helper/recoverLinks");
const { sendMessage } = require("../helper/telegramHelper");
const { format } = require("../helper/dateFormatter");
const { sleep } = require("../helper/sleep");

class TwitterWorker {
  constructor(identities) {
    this.identities = identities;
  }

  async getNewTweets(ctx, fallBackChatId = null) {
    const identity = this.chooseIdentity(ctx, this.identities);

    console.log(`準備使用${identity.id}號人仔偷tweet...`);

    let tweets;
    try {
      await sleep(Math.floor(Math.random() * 10000));
      const { data: responseTweets } = await axios.get(
        `https://twitter.com/i/api/graphql/hhW2vKEEofWsP5bxXKB7Rg/ListLatestTweetsTimeline?variables=%7B%22listId%22%3A%22${twitterList}%22%2C%22count%22%3A20%7D&features=%7B%22blue_business_profile_image_shape_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22vibe_api_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Afalse%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Afalse%2C%22interactive_text_enabled%22%3Atrue%2C%22responsive_web_text_conversations_enabled%22%3Afalse%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`,
        {
          headers: {
            Authorization: identity.twitterAuthorization,
            "X-CSRF-Token": identity.twitterXCsrfToken,
            Cookie: identity.twitterCookie,
          },
        }
      );
      tweets = responseTweets;
      // if (tweets.errors) {
      //   console.log(JSON.stringify(tweets.errors));
      //   throw new Error(JSON.stringify(tweets.errors));
      // }

      const chat_id = ctx?.update.message.chat.id;
      const finalChatId = chat_id || fallBackChatId;
      const lastRetrievedTweets = await this.getLastRetrievedTweets(
        finalChatId
      );

      let extractedTweets = this.extractTweets(tweets);
      if (extractedTweets === undefined) {
        if (ctx) {
          return await sendMessage(ctx, "Twitter又改野整壞左", {
            reply_to_message_id: TweetsMessageThreadId,
          });
        }
        return;
      }

      extractedTweets = extractedTweets
        .filter(
          (tweet) =>
            tweet.entryId.startsWith("tweet-") ||
            tweet.entryId.startsWith("list-conversation-")
        )
        .map((tweet) => this.processTweet(tweet))
        .flat();

      const lastestTweets = extractedTweets.map((t) => t.entryId);

      if (lastRetrievedTweets.includes(extractedTweets[0].entryId)) {
        return ctx
          ? await sendMessage(ctx, "暫時沒有新tweet", {
              reply_to_message_id: TweetsMessageThreadId,
            })
          : null;
      }

      let sliceIndex = -1;
      let allLooped = false;
      let loopIdx = 0;
      while (sliceIndex <= 0 && !allLooped) {
        sliceIndex = extractedTweets.findIndex(
          (tweet) => tweet.entryId === lastRetrievedTweets[loopIdx]
        );
        allLooped = lastRetrievedTweets.length <= ++loopIdx;
      }
      if (sliceIndex > 0) {
        extractedTweets = extractedTweets
          .slice(0, sliceIndex)
          .filter(
            (extractedTweet) =>
              extractedTweet.entryId >= lastRetrievedTweets[loopIdx - 1]
          );
      } else {
        return await sendMessage(
          null,
          `lastRetrievedTweet\n------\n${extractedTweets
            .map((t) => t.entryId)
            .join("\n")}`,
          {
            chat_id: "279337376",
            reply_to_message_id: TweetsMessageThreadId,
          }
        );
      }

      extractedTweets.reverse();
      const completedTweets = [];

      try {
        for (let t of extractedTweets) {
          if (t.spaceUrl) {
            await sendMessage(
              ctx,
              `🎙️ Twitter Space 通知\n\n${t.ownerName}\n${t.spaceUrl}`,
              {
                chat_id: finalChatId,
                reply_to_message_id: TweetsMessageThreadId,
              }
            );
            continue;
          }
          if (!t.retweetUrl) {
            await sendMessage(
              ctx,
              t.url +
                `\n${t.ownerName}\n\n${t.fullText}\n\n投稿時間: ${format(
                  t.createdAt
                )}\n#${t.ownerScreenName}_tweets`,
              {
                chat_id: finalChatId,
                reply_to_message_id: TweetsMessageThreadId,
              }
            );

            const recoveredLinks = await recoverLinks(t.fullText);
            if (recoveredLinks.length > 0) {
              await sendMessage(
                ctx,
                `${t.ownerName}\n🎥 Link: ${recoveredLinks[0]}`,
                {
                  chat_id: finalChatId,
                  reply_to_message_id: TweetsMessageThreadId,
                  disable_web_page_preview: true,
                }
              );
            }

            //To prevent rate limit and preserve message order
            await sleep(1000);
          }

          completedTweets.unshift(t.entryId);
        }
        await this.sendRetweet(ctx, extractedTweets, finalChatId);
      } catch (e) {
        await this.updateLastRetrievedTweets(finalChatId, completedTweets);
      }

      await this.updateLastRetrievedTweets(finalChatId, lastestTweets);
    } catch (e) {
      // For maintainace
      return await sendMessage(
        null,
        `${identity.id}號人仔有d問題, 得閒check下\n${e}`,
        {
          chat_id: "279337376",
          reply_to_message_id: TweetsMessageThreadId,
        }
      );
    }
  }

  chooseIdentity(ctx, identities) {
    const params = ctx?.update.message.text.split(/\s+/);
    if (params && params.length > 1) {
      params.shift();
      return identities[`identity${params[0]}`];
    } else {
      const identitiesArray = Object.keys(identities);
      return identities[
        identitiesArray[Math.floor(Math.random() * identitiesArray.length)]
      ];
    }
  }

  async getLastRetrievedTweets(chat_id, trial = 0) {
    try {
      const {
        data: { data: lastRetrievedTweets },
      } = await axios.get(
        `${replitDbDomain}/db/lastRetrievedTweets?chatId=${chat_id}`
      );

      return lastRetrievedTweets;
    } catch (e) {
      if (trial < 3) {
        return await this.getLastRetrievedTweets(chat_id, trial + 1);
      }
      throw e;
    }
  }

  async updateLastRetrievedTweets(chat_id, tweets, trial = 0) {
    try {
      await axios.put(
        tweets.reduce(
          (prev, curr) => prev + `tweet[]=${curr}&`,
          `${replitDbDomain}/db/lastRetrievedTweets?`
        ) + `chatId=${chat_id}`
      );
    } catch (e) {
      if (trial < 3) {
        await this.updateLastRetrievedTweets(chat_id, tweets, trial + 1);
      }
      throw e;
    }
  }

  async sendRetweet(ctx, extractedTweets, chat_id) {
    if (extractedTweets.filter((t) => t.retweetUrl).length === 0) {
      return;
    }
    const retweetMap = extractedTweets
      .filter((t) => t.retweetUrl)
      .reduce((prev, curr) => {
        if (prev[curr.ownerScreenName]) {
          prev[curr.ownerScreenName].urlObj.push({
            url: curr.retweetUrl,
            owner: curr.retweetOwner,
          });
          return prev;
        }
        return {
          ...prev,
          [curr.ownerScreenName]: {
            urlObj: [{ url: curr.retweetUrl, owner: curr.retweetOwner }],
            name: curr.ownerName,
          },
        };
      }, {});

    await sendMessage(
      ctx,
      `🔄 Retweet 通知\n\n` +
        Object.keys(retweetMap).reduce(
          (prev, curr) =>
            prev +
            `${retweetMap[curr].name}\n${retweetMap[curr].urlObj
              .map((obj) => `<a href='${obj.url}'>${obj.owner} 的 tweet</a>`)
              .join("\n")}\n\n`,
          ""
        ),
      {
        chat_id,
        reply_to_message_id: TweetsMessageThreadId,
        disable_web_page_preview: true,
        parse_mode: "HTML",
      }
    );
  }

  extractTweets(tweets) {
    return tweets?.data?.list?.tweets_timeline?.timeline?.instructions?.find(
      (item) => item.type === "TimelineAddEntries"
    )?.entries;
  }

  processTweet(tweet) {
    if (tweet.entryId.startsWith("list-conversation-")) {
      return this.processListConversation(tweet);
    }

    const entryId = tweet.entryId.replace("tweet-", "");

    let tweetData;
    if (
      tweet.content.itemContent.tweet_results.result.__typename ===
      "TweetWithVisibilityResults"
    ) {
      tweetData = tweet.content.itemContent.tweet_results.result.tweet;
    } else {
      tweetData = tweet.content.itemContent.tweet_results.result;
    }

    const userResults = tweetData.core.user_results.result;
    const ownerName = userResults?.legacy.name;
    const ownerScreenName = userResults?.legacy.screen_name;
    const tweetObject = tweetData.legacy;
    const fullText = tweetObject?.full_text;
    const createdAt = tweetObject?.created_at;

    let media = [];
    if (tweetObject?.extended_entities?.media) {
      media = this.extractMedia(tweetObject.extended_entities.media);
    }

    let spaceObj = {};
    if (tweetObject?.entities?.urls) {
      spaceObj = this.extractTwitterSpace(tweetObject.entities.urls);
    }

    const retweet = tweetObject?.retweeted_status_result;
    let retweetUrlObj;
    if (retweet) {
      retweetUrlObj = this.extractRetweet(retweet);
    }

    return {
      entryId,
      url: `https://vxtwitter.com/${ownerScreenName}/status/${entryId}`,
      ownerScreenName,
      ownerName,
      fullText,
      createdAt,
      media,
      ...(spaceObj || {}),
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

  extractTwitterSpace(urls) {
    const spaceArr = urls.filter((m) =>
      m.expanded_url.includes("https://twitter.com/i/spaces/")
    );
    if (spaceArr.length > 0) {
      return { spaceUrl: spaceArr[0].expanded_url };
    }
  }

  extractRetweet(retweet) {
    let tweetData;
    if (retweet.result.__typename === "TweetWithVisibilityResults") {
      tweetData = retweet.result.tweet;
    } else {
      tweetData = retweet.result;
    }

    const retweetId = tweetData.rest_id;
    const retweetOwnerScreenName =
      tweetData.core.user_results.result.legacy.screen_name;
    return {
      retweetUrl: `https://vxtwitter.com/${retweetOwnerScreenName}/status/${retweetId}`,
      retweetOwner: retweetOwnerScreenName,
    };
  }
}

module.exports = TwitterWorker;
