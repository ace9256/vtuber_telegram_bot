const axios = require("axios");

async function downloadYoutubeStickersHelper(url) {
  let options = {
    method: "GET",
    url,
    headers: {
      cookie:
        "GPS=1; YSC=hIAkWskbrFg; VISITOR_INFO1_LIVE=S4_yrffJJHU; PREF=tz=Asia.Hong_Kong&f6=40000000; SID=HwgQmTW9h5lrSjmwxLpMZHjrUc4JTCGXi3UaYefuTiHiqIeE_ZA6QWfRPYEoCG91q4ocAg.; __Secure-1PSID=HwgQmTW9h5lrSjmwxLpMZHjrUc4JTCGXi3UaYefuTiHiqIeETrH2PU8fXPaj5b9y8dOPNA.; __Secure-3PSID=HwgQmTW9h5lrSjmwxLpMZHjrUc4JTCGXi3UaYefuTiHiqIeEYRL5p_SwUC9yFNq3pNfvog.; HSID=Afc28GUdv_llxhIwG; SSID=ATHJNHBlA81zZQ9Kh; APISID=RVog7kPGY7P_S2oa/A3-BfkivISS7uwzaR; SAPISID=8KQo1ENe_CDOIF1U/Ar1lXpfGztYChTVG7; __Secure-1PAPISID=8KQo1ENe_CDOIF1U/Ar1lXpfGztYChTVG7; __Secure-3PAPISID=8KQo1ENe_CDOIF1U/Ar1lXpfGztYChTVG7; LOGIN_INFO=AFmmF2swRQIgEuAzRGfn6PzNmT3qYCMZMb77hW7LoGjP2zMo8kdHWSMCIQDOq1qtdpazeUOVlv_EFCKZon7xUDoOKQQuBhqc4yTa5A:QUQ3MjNmejJJRzBNd2FNODduTTF2U2lCcG92YzRzbEpLd2NrV0ZPdldzYUxsTHk3ekFKeHNzb2FyVVFlRm94ZWxMQmhHQmtRNm82Szl6SXFPX0hKd2dmV3NnMHhiQ09ya3dGdEpWTVZIZzVwZkk4X3MwV3FWQ1ZqSl8zUENndlExLU50VEh4RUNTSVVyQTNHQzdzZXRySHphZkx4NTJFRWNR; CONSISTENCY=AGDxDeNlRkZokYLNv_DSOpG_8-sUcdkfQ9WTdhSbvN3aUueS6Kw43pGeXslhzNfnzfyU5IkYEfTS2gSBk2qfwi5lZjYUQ409jksC0IWpr9DEZcZ06SAk19Cd-No; SIDCC=AJi4QfFi2XyD4Zu4_E2NtSWrLoqaUkWgCV94KPNGPusH7Kd0D4htBCjZ_iDitGI1dXmgB9jd6w; __Secure-3PSIDCC=AJi4QfEvDyEqqdFAF2sgRPow58_QA1-vtdIvkDjMKjuURHYVhFrRGm2anFnXj09JbNEpa4m-TA",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="99", "Microsoft Edge";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "Upgrade-Insecure-Requests": "1",
      DNT: "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.30",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "Service-Worker-Navigation-Preload": "true",
    },
  };

  const response = await axios.request(options);
  let itemParams = JSON.parse(
    response.data.split(`ypcGetOffersEndpoint":`)[1].split("},")[0]
  ).params;
  options = {
    method: "POST",
    url: "https://www.youtube.com/youtubei/v1/ypc/get_offers",
    params: {
      key: "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
      prettyPrint: "false",
    },
    headers: {
      cookie:
        "GPS=1; YSC=hIAkWskbrFg; VISITOR_INFO1_LIVE=S4_yrffJJHU; PREF=tz=Asia.Hong_Kong&f6=40000000; SID=HwgQmTW9h5lrSjmwxLpMZHjrUc4JTCGXi3UaYefuTiHiqIeE_ZA6QWfRPYEoCG91q4ocAg.; __Secure-1PSID=HwgQmTW9h5lrSjmwxLpMZHjrUc4JTCGXi3UaYefuTiHiqIeETrH2PU8fXPaj5b9y8dOPNA.; __Secure-3PSID=HwgQmTW9h5lrSjmwxLpMZHjrUc4JTCGXi3UaYefuTiHiqIeEYRL5p_SwUC9yFNq3pNfvog.; HSID=Afc28GUdv_llxhIwG; SSID=ATHJNHBlA81zZQ9Kh; APISID=RVog7kPGY7P_S2oa/A3-BfkivISS7uwzaR; SAPISID=8KQo1ENe_CDOIF1U/Ar1lXpfGztYChTVG7; __Secure-1PAPISID=8KQo1ENe_CDOIF1U/Ar1lXpfGztYChTVG7; __Secure-3PAPISID=8KQo1ENe_CDOIF1U/Ar1lXpfGztYChTVG7; LOGIN_INFO=AFmmF2swRQIgEuAzRGfn6PzNmT3qYCMZMb77hW7LoGjP2zMo8kdHWSMCIQDOq1qtdpazeUOVlv_EFCKZon7xUDoOKQQuBhqc4yTa5A:QUQ3MjNmejJJRzBNd2FNODduTTF2U2lCcG92YzRzbEpLd2NrV0ZPdldzYUxsTHk3ekFKeHNzb2FyVVFlRm94ZWxMQmhHQmtRNm82Szl6SXFPX0hKd2dmV3NnMHhiQ09ya3dGdEpWTVZIZzVwZkk4X3MwV3FWQ1ZqSl8zUENndlExLU50VEh4RUNTSVVyQTNHQzdzZXRySHphZkx4NTJFRWNR; CONSISTENCY=AGDxDeNlRkZokYLNv_DSOpG_8-sUcdkfQ9WTdhSbvN3aUueS6Kw43pGeXslhzNfnzfyU5IkYEfTS2gSBk2qfwi5lZjYUQ409jksC0IWpr9DEZcZ06SAk19Cd-No; SIDCC=AJi4QfFi2XyD4Zu4_E2NtSWrLoqaUkWgCV94KPNGPusH7Kd0D4htBCjZ_iDitGI1dXmgB9jd6w; __Secure-3PSIDCC=AJi4QfEvDyEqqdFAF2sgRPow58_QA1-vtdIvkDjMKjuURHYVhFrRGm2anFnXj09JbNEpa4m-TA",
      "x-origin": "https://www.youtube.com",
      authorization:
        "SAPISIDHASH 1646754080_a5e325c3e6632c169dba49afa74e79dac2d9b712",
    },
    data: {
      context: {
        client: {
          hl: "zh-TW",
          gl: "HK",
          remoteHost: "113.254.245.201",
          deviceMake: "",
          deviceModel: "",
          visitorData: "CgtTNF95cmZmSkpIVSiP8p2RBg%3D%3D",
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.30,gzip(gfe)",
          clientName: "WEB",
          clientVersion: "2.20220307.01.00",
          osName: "Windows",
          osVersion: "10.0",
          originalUrl:
            "https://www.youtube.com/channel/UCFKOVgVbGmX65RxO3EtH3iw/membership",
          platform: "DESKTOP",
          clientFormFactor: "UNKNOWN_FORM_FACTOR",
          configInfo: {
            appInstallData: "CI_ynZEGEJjqrQUQt8utBRD1-K0FEPzW_RIQkfj8EhDYvq0F",
          },
          userInterfaceTheme: "USER_INTERFACE_THEME_DARK",
          timeZone: "Asia/Hong_Kong",
          browserName: "Edge Chromium",
          browserVersion: "99.0.1150.30",
          screenWidthPoints: 961,
          screenHeightPoints: 929,
          screenPixelDensity: 1,
          screenDensityFloat: 1,
          utcOffsetMinutes: 480,
          connectionType: "CONN_CELLULAR_4G",
          memoryTotalKbytes: "8000000",
          mainAppWebInfo: {
            graftUrl:
              "https://www.youtube.com/channel/UCFKOVgVbGmX65RxO3EtH3iw/membership",
            pwaInstallabilityStatus: "PWA_INSTALLABILITY_STATUS_UNKNOWN",
            webDisplayMode: "WEB_DISPLAY_MODE_BROWSER",
            isWebNativeShareAvailable: true,
          },
        },
        user: { lockedSafetyMode: false },
        request: {
          useSsl: true,
          internalExperimentFlags: [],
          consistencyTokenJars: [
            {
              encryptedTokenJarContents:
                "AGDxDeNlRkZokYLNv_DSOpG_8-sUcdkfQ9WTdhSbvN3aUueS6Kw43pGeXslhzNfnzfyU5IkYEfTS2gSBk2qfwi5lZjYUQ409jksC0IWpr9DEZcZ06SAk19Cd-No",
              expirationSeconds: "600",
            },
          ],
        },
        clickTracking: {
          clickTrackingParams: "CCAQqGAiEwjkjf337Lb2AhX8plYBHeAODT8=",
        },
        adSignalsInfo: {
          params: [
            { key: "dt", value: "1646754062838" },
            { key: "flash", value: "0" },
            { key: "frm", value: "0" },
            { key: "u_tz", value: "480" },
            { key: "u_his", value: "6" },
            { key: "u_h", value: "1080" },
            { key: "u_w", value: "1920" },
            { key: "u_ah", value: "1032" },
            { key: "u_aw", value: "1920" },
            { key: "u_cd", value: "24" },
            { key: "bc", value: "31" },
            { key: "bih", value: "929" },
            { key: "biw", value: "945" },
            {
              key: "brdim",
              value: "1920,0,1920,0,1920,0,1920,1032,961,929",
            },
            { key: "vis", value: "1" },
            { key: "wgl", value: "true" },
            { key: "ca_type", value: "image" },
          ],
        },
      },
      itemParams,
    },
  };

  const res2 = await axios.request(options);
  const arr = [];
  const result = [
    ...res2.data.actions[0].openPopupAction.popup.sponsorshipsOfferRenderer.tiers[0].sponsorshipsTierRenderer.perks.sponsorshipsPerksRenderer.perks[0].sponsorshipsPerkRenderer.images.map(
      (el) => el.thumbnails[0].url
    ),
    ...res2.data.actions[0].openPopupAction.popup.sponsorshipsOfferRenderer.tiers[0].sponsorshipsTierRenderer.perks.sponsorshipsPerksRenderer.perks[1].sponsorshipsPerkRenderer.images.map(
      (el) => el.thumbnails[0].url
    ),
  ].forEach((el, idx) => {
    var url =
      el.split("=")[0] +
      `=w512-h512-c-k-nd?random=${Math.floor(Math.random() * 100)}`;
    arr.push(url);
  });
  return arr;
}

module.exports = { downloadYoutubeStickersHelper };
