const express = require("express");
const app = require("./index")

module.exports = (req, res) => {
  app(req, res);
};
