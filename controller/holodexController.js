const HolodexService = require("../service/holodexService");

class HolodexController {
  constructor() {
    this.holodexService = new HolodexService();
  }

  async getTwitchLives(req, res) {
    try {
      console.log(req.query.token);
      const data = await this.holodexService.getTwitchLives(req.query.token);
      res.json(data);
    } catch (e) {
      console.log(e);
      res.json({ error: e });
    }
  }
}

module.exports = HolodexController;
