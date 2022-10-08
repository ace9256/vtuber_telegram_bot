//http_method command service method
const recommandChoices = [
  [{ text: "直播緊既歌枠", callback_data: "singingNow" }],
  [{ text: "直播緊既ASMR", callback_data: "asmrNow" }],
  [{ text: "黎緊一個鐘開始既歌枠", callback_data: "singingFuture" }],
  [{ text: "黎緊一個鐘開始既ASMR", callback_data: "asmrFuture" }],
];

const actions = [
  recommandChoices.map((choice) => [
    { ...choice[0], service: "holodexService" },
  ]),
].flat();

module.exports = { actions, recommandChoices };
