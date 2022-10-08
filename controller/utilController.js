const axios = require("axios");

class UtilController {
  constructor() {}

  async pingHandler(req, res) {
    res.json({ ping: true });
  }

  async proxy(req, res) {
    try {
      console.log(req.query.url);
      const { data } = await axios(req.query.url, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(data, "binary").toString("base64");
      console.log(typeof buffer);
      console.log(buffer);
      res.json({ buffer });
    } catch (e) {
      console.log(e);
      res.json({ error: e });
    }
  }
}

module.exports = UtilController;
