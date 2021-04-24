const express = require("express");
const router = express.Router();
const lunette = require("../services/product");

router.get("/lunette", function (req, res, next) {
  let lunettes = lunette.getAll();
  res.json({ products: lunettes, total: lunettes.length });
});

router.get("/lentille", function (req, res, next) {});

module.exports = router;
