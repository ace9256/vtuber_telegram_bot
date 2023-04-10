const express = require("express");
const cors = require("cors");
const { routes } = require("./list/routes");
const { expressWrapper } = require("./wrapper");

const requireDir = require("require-dir");
const controllerClasses = requireDir("./controller");
const controllers = Object.keys(controllerClasses).reduce(
  (memo, controller) => ({
    ...memo,
    [controller]: new controllerClasses[controller](),
  }),
  {}
);

const expressListen = (port) => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  routes.forEach((route) => {
    const routeArr = route.split(" ");
    eval(
      `app.${routeArr[0]}(routeArr[1], expressWrapper(controllers[routeArr[2]], routeArr[3]))`
    );
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

module.exports = { expressListen };
