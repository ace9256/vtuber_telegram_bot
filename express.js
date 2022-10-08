const express = require("express");
const cors = require('cors')
const { routes } = require("./list/routes");
const { expressWrapper } = require("./wrapper");

const expressListen = (port) => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors())
  for (let route of routes) {
    const routeArr = route.split(" ");
    const Klass = require(`./controller/${routeArr[2]}`);
    eval(
      `app.${routeArr[0]}('${routeArr[1]}', expressWrapper(new Klass(), '${routeArr[3]}'))`
    );
  }
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

module.exports = { expressListen };
