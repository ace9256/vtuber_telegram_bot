//command service method
const commandList = [
  //utilService
  "chat_details utilService chatDetails",
  "check_sc utilService checkSC",
  "check_chat utilService checkChat",
  "check_viewers utilService checkViewers",
  "check_spectating_lists utilService checkSpectatingLists",
  "check_stickers_list utilService checkStickersList",
  "crime utilService crime",
  "pin utilService memo",
  "unpin utilService delMemo",
  "random utilService random",
  //chatService
  "greeting chatService genChatScript",
  "osakana chatService genChatScript",
  "katsumoku chatService genChatScript",
  "jyakin chatService genChatScript",
  "konkoyo chatService genChatScript",
  "konnene chatService genChatScript",
  "line chatService genChatScript",
  "konnyanyase chatService genChatScript",
  "100 chatService genChatScript",
  "100w chatService genChatScript",
  "100f chatService genChatScript",
  "money chatService genChatScript",
  "100random chatService random100",
  "5050 chatService fiftyFifty",
  //holodexService
  "get_channels holodexService getChannels",
  "get_current_streams holodexService getCurrentStreams",
  "recommand holodexService recommand",
  //holocureService
  "holocure holocureService getHolocure",
  //shopifyService
  "quantity shopifyService getQuantity",
  //twitterService
  "check_twitter twitterService checkTwitter",
];

const commandWithParamsList = [
  "提我.* utilService setAlarm",
  "\/alarm.* utilService setAlarm",
  "\/alarm@laplusdarknesssssbot.* utilService setAlarm",
  "\/del_alarm.* utilService delAlarm",
  "\/del_alarm@laplusdarknesssssbot.* utilService delAlarm",
  "down圖.* utilService downloadYoutubeStickers",
  "\/cal.* utilService calculate",
  "\/unpin.* utilService delMemo",
  "\/t.* utilService translate",
  "@here chatService tagAll",
  "\/ocr.* utilService ocr",
];

module.exports = { commandList, commandWithParamsList };
