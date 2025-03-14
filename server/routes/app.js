var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Go up two directory levels from server/routes to reach project root
  res.sendFile(path.join(__dirname, '../../dist/cms-project/browser/index.html'));
});

module.exports = router;