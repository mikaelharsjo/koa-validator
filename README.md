[![Build Status](https://travis-ci.org/mikaelharsjo/koa-validator.svg?branch=master)](https://travis-ci.org/mikaelharsjo/koa-validator)
[ ![Codeship Status for mikaelharsjo/koa-validator](https://www.codeship.io/projects/67fa8600-01e3-0132-196f-6a159f2f8cde/status)](https://www.codeship.io/projects/30243)

koa-validator
=============

Koa.js middleware that adds validation functionality.

This module is heavily inspired by [express-validator](https://github.com/ctavan/express-validator). It´s purpose is to extend `Context` with validation methods taken from [validator.js](https://github.com/chriso/validator.js)

## Install
    npm install koa_validator 

## Usage
    var koa = require('koa');
    var bodyParser = require('koa-body-parser');
    var koaValidator = require('koa_validator');
    var app = koa();
    
    app.use(bodyParser());
    
    app.use(koaValidator());
    
    app.use(function *(next){
    	this.checkQuery('getparam', 'Invalid getparam').isInt().notEmpty();
    	this.checkParams('urlparam', 'No url param').notEmpty();
    	this.checkBody('postParam', 'Invalid postparam').isAlpha();
    	this.body = this.validationErrors();
    	yield next
    });
    
    app.listen(3000);
    
## Running example
Clone the repo, install dependencies and start the server

        $ git clone git://github.com/mikaelharsjo/koa-validator.git --depth 1
        $ cd koa-validator
        $ npm install
        $ npm start

Some sample urls to try with

        $ curl http://localhost:3000/test?getparam=test
        -> [{"param":"getparam","msg":"Invalid getparam","value":"test"}]
        
        $ curl -d 'postparam=1' http://localhost:3000/test?getparam=1
        -> [ { param: 'postparam', msg: 'Invalid postparam', value: '1' } ]        

## Running tests
        $ npm test

## License
MIT
