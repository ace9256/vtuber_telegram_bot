const followRedirect = require("follow-redirect-url");

const SitesDomain = ["www.youtube.com", "www.twitch.tv", "twitcasting.tv"];

const recovereLinks = async (text) => {
  const links = text.split("https://");
  links.shift();
  links.pop();
  let recoveredLinks = [];
  for (let link of links) {
    const recoveredLink = await followRedirect.startFollowing(
      link.split(" ")[0]
    );
    if (
      SitesDomain.some((s) =>
        recoveredLink[recoveredLink.length - 1].url?.includes(s)
      )
    ) {
      recoveredLinks.push(recoveredLink[recoveredLink.length - 1].url);
    }
  }
  return recoveredLinks;
};

module.exports = { recovereLinks };
