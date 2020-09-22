var AWS = require('aws-sdk');

var express = require('express');
var router = express.Router();

AWS.config.update({region: 'us-east-1'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
