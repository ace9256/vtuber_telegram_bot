const axios = require("axios");
const { token, appwriteDomain } = require("../env");

class PingWorker {
  constructor() {}

  async ping() {
    console.log('-----ping-----')
    await axios.get(`${appwriteDomain}/ping`);
  }
}

module.exports = PingWorker;
