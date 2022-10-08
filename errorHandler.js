const axios = require("axios");
const { token } = require("./env");

const botErrorHandler = async (e, ctx) => {
  console.log("Error caught by wrapper");
  console.log(e);
};

const expressErrorHandler = async (e, req, res) => {
  console.log("Error caught by wrapper");
  console.log(e);
};

module.exports = { botErrorHandler, expressErrorHandler };
