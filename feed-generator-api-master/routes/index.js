var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({api:'iDoormedia Digital Feed Generator API' });
});

module.exports = router;
