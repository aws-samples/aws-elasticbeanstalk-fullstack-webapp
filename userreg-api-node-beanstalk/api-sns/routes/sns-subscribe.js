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
require('dotenv').config();

const snsTopic =  process.env.VAR1;

router.post("/", (req, res, next) => { 
    AWS.config.region = process.env.AWS_REGION || 'us-east-1';
    var sns = new AWS.SNS({apiVersion: '2010-03-31'});
    sns.publish({
        'Message': 'Name: ' + req.body.name + "\r\nEmail: " + req.body.email,
        'Subject': 'A new user has signed up for the User Registration app!!!',
        'TopicArn': snsTopic
    }, function(error, data) { 
        if(error) res.send(error);
        else res.send(data);
    });
});

router.get('/', function(req, res, next) {
    res.send('Service is running in a docker');
});

module.exports = router;