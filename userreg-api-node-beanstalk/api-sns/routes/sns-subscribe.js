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