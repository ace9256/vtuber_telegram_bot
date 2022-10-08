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
  //chatService
  "55 chatService well",
  "54 chatService noNeed",
  "ngng chatService well2",
  "greeting chatService greeting",
  "5050 chatService fiftyFifty",
  "osakana chatService osakana",
  "katsumoku chatService katsumoku",
  "jyakin chatService jyakin",
  "konkoyo chatService konkoyo",
  "konnene chatService konnene",
  "100 chatService desuwa",
  "100w chatService herb",
  "100f chatService fuck",
  "100random chatService random100",
  //holodexService
  "get_channels holodexService getChannels",
  "get_current_streams holodexService getCurrentStreams",
  "pin utilService memo",
  "unpin utilService delMemo",
  //holocureService
  "holocure holocureService getHolocure",
];

const commandWithParamsList = [
  "^提我.* utilService setAlarm",
  "^\/alarm.* utilService setAlarm",
  "^\/alarm@laplusdarknesssssbot.* utilService setAlarm",
  "^\/del_alarm.* utilService delAlarm",
  "^\/del_alarm@laplusdarknesssssbot.* utilService delAlarm",
  "^down圖.* utilService downloadYoutubeStickers",
  "^\/cal.* utilService calculate",
  "^\/unpin.* utilService delMemo",
  "^\/t.* utilService translate",
];

module.exports = { commandList, commandWithParamsList };
