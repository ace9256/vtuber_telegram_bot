const followRedirect = require("follow-redirect-url");

const recovereLinks = async (text) => {
  const links = text.split("https://");
  links.shift();
  let recoveredLinks = [];
  for (let link of links) {
    const recoveredLink = await followRedirect.startFollowing(
      link.split(" ")[0]
    );
    if (
      recoveredLink[recoveredLink.length - 1].url &&
      (recoveredLink[recoveredLink.length - 1].url.includes(
        "www.youtube.com"
      ) ||
        recoveredLink[recoveredLink.length - 1].url.includes("www.twitch.tv"))
    ) {
      recoveredLinks.push(recoveredLink[recoveredLink.length - 1].url);
    }
  }
  return recoveredLinks;
};

module.exports = { recovereLinks };
