var express = require('express');
var router = express.Router();

var AWS = require('aws-sdk');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Router for updating DB' });
});

router.post("/", (req, res, next) => {
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
  
    console.log(req);
  
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
  
    var params = {
      TableName: 'signup',
      Item: {
        'name': {S: name},
        'email': {S: email},
        'phone': {S: phone}
      }
    };
  
    ddb.putItem(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        res.send(err);
      } else {
        console.log("Success", data);
        res.send(data);
      }
    });
  
  });

  module.exports = router;