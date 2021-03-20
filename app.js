"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const routes = require("./routes"); 

const app = express();
const port = 3000;

app.use(bodyParser.json());

routes(app);

app.all("*", (req, res) => {
  return res.status(404).json({
    message: "Not found",
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});