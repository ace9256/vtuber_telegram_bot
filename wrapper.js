const { botErrorHandler, expressErrorHandler } = require("./errorHandler");
const { accessRightChecker } = require("./middlewares/accessRightChecker")

const botWrapper = (klass, f) => async (ctx) => {
  {
    try {
      await accessRightChecker(ctx)
      await eval(`klass.${f}(ctx)`);
    } catch (e) {
      await botErrorHandler(e, ctx);
    }
  }
};

const expressWrapper = (klass, f) => async (req, res) => {
  {
    try {
      await eval(`klass.${f}(req, res)`);
    } catch (e) {
      await expressErrorHandler(e, req, res);
    }
  }
};

module.exports = { botWrapper, expressWrapper };
