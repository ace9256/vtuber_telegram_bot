const axios = require("axios");
const { holodexApiKey } = require("../env");

const fetchHolodex = async (url) => {
  return (
    await axios.get(url, {
      headers: { "X-APIKEY": holodexApiKey },
    })
  ).data;
};

module.exports = { fetchHolodex };
