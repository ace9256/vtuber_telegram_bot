const channelList = [
  {
    id: "UCJFZiqLMntJufDCHc6bQixg",
    name: "hololive ホロライブ - VTuber Group",
    org: "Hololive",
    group: "",
  },
  {
    id: "UCotXwY6s8pWmuWd_snKYjhg",
    name: "hololive English",
    org: "Hololive",
    group: "",
  },
  {
    id: "UCfrWoRGlawPQDQxxeIDRP0Q",
    name: "hololive Indonesia",
    org: "Hololive",
    group: "",
  },
  {
    id: "UC0TXe_LYZ4scaW2XMyi5_kw",
    name: "AZKi Channel",
    org: "Hololive",
    group: "",
  },
  {
    id: "UC5CwaMl1eIgY8h02uZw7u8A",
    name: "Suisei Channel",
    org: "Hololive",
    group: "",
  },
  {
    id: "UCDqI2jOz0weumE8s7paEk6g",
    name: "Roboco Ch. - ロボ子",
    org: "Hololive",
    group: "",
  },
  {
    id: "UC-hM6YJuNYVAmUWxeIr9FeA",
    name: "Miko Ch. さくらみこ",
    org: "Hololive",
    group: "",
  },
  {
    id: "UCp6993wxpyDPHUpavwDFqgg",
    name: "SoraCh. ときのそらチャンネル",
    org: "Hololive",
    group: "",
  },
  {
    id: "UC1CfXB_kRs3C-zaeTG3oGyg",
    name: "HAACHAMA Ch 赤井はあと",
    org: "Hololive",
    group: "1st Generation",
  },
  {
    id: "UCD8HOxPs4Xvsm8H0ZxXGiBw",
    name: "Mel Channel 夜空メルチャンネル",
    org: "Hololive",
    group: "1st Generation",
  },
  {
    id: "UCdn5BQ06XqgXoAxIhbqw5Rg",
    name: "フブキCh。白上フブキ",
    org: "Hololive",
    group: "1st Generation",
  },
  {
    id: "UCFTLzh12_nrtzqBPsTCqenA",
    name: "アキロゼCh。Vtuber/ホロライブ所属",
    org: "Hololive",
    group: "1st Generation",
  },
  {
    id: "UCHj_mh57PVMXhAUDphUQDFA",
    name: "HAACHAMA DARKWEB CH",
    org: "Hololive",
    group: "1st Generation",
  },
  {
    id: "UCLbtM3JZfRTg8v2KGag-RMw",
    name: "AkiRose Ch.アキ・ローゼンタールSub",
    org: "Hololive",
    group: "1st Generation",
  },
  {
    id: "UCQ0UDLQCjY0rmuxCDE38FGg",
    name: "Matsuri Channel 夏色まつり",
    org: "Hololive",
    group: "1st Generation",
  },
  {
    id: "UC1opHUrw8rvnsadT-iGp7Cg",
    name: "Aqua Ch. 湊あくあ",
    org: "Hololive",
    group: "2nd Generation",
  },
  {
    id: "UC1suqwovbL1kzsoaZgFZLKg",
    name: "Choco Ch. 癒月ちょこ",
    org: "Hololive",
    group: "2nd Generation",
  },
  {
    id: "UC7fk0CB07ly8oSl0aqKkqFg",
    name: "Nakiri Ayame Ch. 百鬼あやめ",
    org: "Hololive",
    group: "2nd Generation",
  },
  {
    id: "UCp3tgHXw_HI0QMk1K8qh3gQ",
    name: "Choco subCh. 癒月ちょこ",
    org: "Hololive",
    group: "2nd Generation",
  },
  {
    id: "UCvzGlP9oQwU--Y0r9id_jnA",
    name: "Subaru Ch. 大空スバル",
    org: "Hololive",
    group: "2nd Generation",
  },
  {
    id: "UCXTpFs_3PqI41qX2d9tL2Rw",
    name: "Shion Ch. 紫咲シオン",
    org: "Hololive",
    group: "2nd Generation",
  },
  {
    id: "UChAnqc_AY5_I3Px5dig3X1Q",
    name: "Korone Ch. 戌神ころね",
    org: "Hololive",
    group: "GAMERS",
  },
  {
    id: "UCp-5t9SrOQwXMU7iIjQfARg",
    name: "Mio Channel 大神ミオ",
    org: "Hololive",
    group: "GAMERS",
  },
  {
    id: "UCvaTdHTWBGv3MKj3KVqJVCw",
    name: "Okayu Ch. 猫又おかゆ",
    org: "Hololive",
    group: "GAMERS",
  },
  {
    id: "UC1DCedRgGHBdm81E1llLhOQ",
    name: "Pekora Ch. 兎田ぺこら",
    org: "Hololive",
    group: "3rd Generation",
  },
  {
    id: "UCCzUftO8KOVkV4wQG1vkUvg",
    name: "Marine Ch. 宝鐘マリン",
    org: "Hololive",
    group: "3rd Generation",
  },
  {
    id: "UCdyqAaZDKHXg4Ahi7VENThQ",
    name: "Noel Ch. 白銀ノエル",
    org: "Hololive",
    group: "3rd Generation",
  },
  {
    id: "UCl_gCybOJRIgOXw6Qb4qJzQ",
    name: "Rushia Ch. 潤羽るしあ",
    org: "Hololive",
    group: "3rd Generation",
  },
  {
    id: "UCvInZx9h3jC2JzsIzoOebWg",
    name: "Flare Ch. 不知火フレア",
    org: "Hololive",
    group: "3rd Generation",
  },
  {
    id: "UC1uv2Oq6kNxgATlCiez59hw",
    name: "Towa Ch. 常闇トワ",
    org: "Hololive",
    group: "4th Generation",
  },
  {
    id: "UCa9Y57gfeY0Zro_noHRVrnw",
    name: "Luna Ch. 姫森ルーナ",
    org: "Hololive",
    group: "4th Generation",
  },
  {
    id: "UCqm3BQLlJfvkTsX_hvm0UmA",
    name: "Watame Ch. 角巻わため",
    org: "Hololive",
    group: "4th Generation",
  },
  {
    id: "UCZlDXzGoo7d44bwdNObFacg",
    name: "Kanata Ch. 天音かなた",
    org: "Hololive",
    group: "4th Generation",
  },
  {
    id: "UCAWSyEs_Io8MtpY3m-zqILA",
    name: "Nene Ch.桃鈴ねね",
    org: "Hololive",
    group: "5th Generation",
  },
  {
    id: "UCFKOVgVbGmX65RxO3EtH3iw",
    name: "Lamy Ch. 雪花ラミィ",
    org: "Hololive",
    group: "5th Generation",
  },
  {
    id: "UCK9V2B22uJYu3N7eR_BT9QA",
    name: "Polka Ch. 尾丸ポルカ",
    org: "Hololive",
    group: "5th Generation",
  },
  {
    id: "UCUKD-uaobj9jiqB-VXt71mA",
    name: "Botan Ch.獅白ぼたん",
    org: "Hololive",
    group: "5th Generation",
  },
  {
    id: "UC6eWCld0KwmyHFbAqK3V-Rw",
    name: "Koyori ch. 博衣こより - holoX -",
    org: "Hololive",
    group: "6th Generation (HoloX)",
  },
  {
    id: "UCENwRMx5Yh42zWpzURebzTw",
    name: "Laplus ch. ラプラス・ダークネス - holoX -",
    org: "Hololive",
    group: "6th Generation (HoloX)",
  },
  {
    id: "UCIBY1ollUsauvVi4hW4cumw",
    name: "Chloe ch. 沙花叉クロヱ - holoX -",
    org: "Hololive",
    group: "6th Generation (HoloX)",
  },
  {
    id: "UCs9_O1tRPMQTHQ-N_L6FU2g",
    name: "Lui ch. 鷹嶺ルイ - holoX -",
    org: "Hololive",
    group: "6th Generation (HoloX)",
  },
  {
    id: "UC_vMYWcDjmfdpH6r4TTn1MQ",
    name: "Iroha ch. 風真いろは - holoX -",
    org: "Hololive",
    group: "6th Generation (HoloX)",
  },
  {
    id: "UCAoy6rzhSf4ydcYjJw3WoVg",
    name: "Airani Iofifteen Channel hololive-ID",
    org: "Hololive",
    group: "Indonesia 1st Gen",
  },
  {
    id: "UCOyYb1c43VlX9rc_lT6NKQw",
    name: "Ayunda Risu Ch. hololive-ID",
    org: "Hololive",
    group: "Indonesia 1st Gen",
  },
  {
    id: "UCP0BspO_AMEe3aQqqpo89Dg",
    name: "Moona Hoshinova hololive-ID",
    org: "Hololive",
    group: "Indonesia 1st Gen",
  },
  {
    id: "UC727SQYUvx5pDDGQpTICNWg",
    name: "Anya Melfissa Ch. hololive-ID",
    org: "Hololive",
    group: "Indonesia 2nd Gen",
  },
  {
    id: "UChgTyjG-pdNvxxhdsXfHQ5Q",
    name: "Pavolia Reine Ch. hololive-ID",
    org: "Hololive",
    group: "Indonesia 2nd Gen",
  },
  {
    id: "UCYz_5n-uDuChHtLo7My1HnQ",
    name: "Kureiji Ollie Ch. hololive-ID",
    org: "Hololive",
    group: "Indonesia 2nd Gen",
  },
  {
    id: "UCHsx4Hqa-1ORjQTh9TYDhww",
    name: "Takanashi Kiara Ch. hololive-EN",
    org: "Hololive",
    group: "English (Myth)",
  },
  {
    id: "UCL_qhgtOy0dy1Agp8vkySQg",
    name: "Mori Calliope Ch. hololive-EN",
    org: "Hololive",
    group: "English (Myth)",
  },
  {
    id: "UCMwGHR0BTZuLsmjY_NT5Pwg",
    name: "Ninomae Ina'nis Ch. hololive-EN",
    org: "Hololive",
    group: "English (Myth)",
  },
  {
    id: "UCoSrY_IQQVpmIRZ9Xf-y93g",
    name: "Gawr Gura Ch. hololive-EN",
    org: "Hololive",
    group: "English (Myth)",
  },
  {
    id: "UCyl1z3jo3XHR1riLFKG5UAg",
    name: "Watson Amelia Ch. hololive-EN",
    org: "Hololive",
    group: "English (Myth)",
  },
  {
    id: "UC8rcEBzJSleTkf_-agPM20g",
    name: "IRyS Ch. hololive-EN",
    org: "Hololive",
    group: "",
  },
  {
    id: "UC3n5uGu18FoCy23ggWWp8tA",
    name: "Nanashi Mumei Ch. hololive-EN",
    org: "Hololive",
    group: "English (Council)",
  },
  {
    id: "UCgmPnx-EEeOrZSg5Tiw7ZRQ",
    name: "Hakos Baelz Ch. hololive-EN",
    org: "Hololive",
    group: "English (Council)",
  },
  {
    id: "UCmbs8T6MWqUHP1tIQvSgKrg",
    name: "Ouro Kronii Ch. hololive-EN",
    org: "Hololive",
    group: "English (Council)",
  },
  {
    id: "UCO_aKKYxn4tvrqPjcTzZ6EQ",
    name: "Ceres Fauna Ch. hololive-EN",
    org: "Hololive",
    group: "English (Council)",
  },
  {
    id: "UCsUj0dszADCGbF3gNrQEuSQ",
    name: "Tsukumo Sana Ch. hololive-EN",
    org: "Hololive",
    group: "English (Council)",
  },
];

module.exports = { channelList };
