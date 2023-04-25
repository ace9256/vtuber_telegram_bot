const token = process.env["TG_TOKEN"];
const port = process.env["PORT"];
const holodexApiKey = process.env["HOLODEX_API_KEY"];
const ocrApiKey = process.env["OCR_API_KEY"];
const twitterList = process.env["TWITTER_LIST"];

class Identity {
  constructor(id, twitterAuthorization, twitterCookie, twitterXCsrfToken) {
    this.id = id
    this.twitterAuthorization = twitterAuthorization;
    this.twitterCookie = twitterCookie;
    this.twitterXCsrfToken = twitterXCsrfToken;
  }
}

const identities = Array.from({ length: 5 }, (_, i) => i + 1).reduce(
  (prev, curr) => ({
    ...prev,
    [`identity${curr}`]: new Identity(
      curr,
      process.env[`TWITTER_AUTHORIZATION_${curr}`],
      process.env[`TWITTER_COOKIE_${curr}`],
      process.env[`TWITTER_X_CSRF_TOKEN_${curr}`]
    ),
  }),
  {}
);

module.exports = {
  token,
  port,
  holodexApiKey,
  ocrApiKey,
  identities,
  twitterList,
};
