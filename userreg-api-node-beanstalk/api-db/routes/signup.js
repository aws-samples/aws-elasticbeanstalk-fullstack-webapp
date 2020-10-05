// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

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