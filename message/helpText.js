const helpText = `
系統
/start 啟動bot
/help 指令清單
/5050 擲公字
/alarm 在command後加上時間,日期,文字就會設置alarm,只輸入command就是查詢alarm
/del_alarm 在command後加上數字就是刪除指定alarm,只輸入command就是刪除所有alarm
/t 翻譯
/cal 計數
/pin quote message就會自動pin, 沒有quote就會列出已pin的項目
/unpin 在command後加上數字就是刪除指定pinned message,只輸入command就是刪除所有pinned message
/crime 查看近期犯罪

打招呼
/greeting 用拉普語打招呼
/55 同棍dee打招呼
/54 棍\: 不了
/ngng 同老公打招呼
/osakana おさかな！！！
/katsumoku かつもく～かつもく～
/jyakin ジャキン！！
/konkoyo こんこよ～
/konnene こんねね～
/100 壱、十、百、千、満点サロメ♡～
/100w おハーブですわ～
/100f おファックですわ～
/100random ランダムですわ～

查詢
/check_sc 查看影片SC
/check_chat 查看影片ホロメン留言
/check_viewers 查看觀眾人數
/get_current_streams 查看Live資料
/check_spectating_lists 查看bot現在正在追蹤的名單
/check_stickers_list 查看Stickers清單
/holocure 查看Holocure更新日期及下載連結
/recommand 尋找推薦直播
`;
const commandArr = helpText
  .split("\n")
  .filter((el) => el.includes("/"))
  .map((el) => ({
    command: el.split(" ")[0],
    description: el.split(" ")[1],
  }));

module.exports = { helpText, commandArr };
