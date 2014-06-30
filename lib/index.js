/*jslint node: true */
'use strict';
var validator = require('./validator');
var Validator = validator.Validator;
var validationErrors = validator.validationErrors;

function createError(param, msg, value){
	return { 
		param: param,
		msg: msg,
		value: value 
	};
}

function koaValidator(options){
	return function *(next){
		validator.initialize();
		this.checkQuery = checkQuery;
		this.checkParams = checkParams;
		this.checkBody = checkBody;
		this.validationErrors = validationErrors;

		yield next;
	};
}

function checkQuery(param, msg){
	var check = { 
		param: param, 
		msg: msg, 
		value: this.query[param]
	};
	return new Validator(check);
}

function checkParams(param, msg){
	var urlParam = this.url.split('/').slice(-1)[0];
	var check = { 
		param: param, 
		msg: msg, 
		value: urlParam
	};
	return new Validator(check);	
}

function checkBody(param, msg){
	var check = { 
		param: param, 
		msg: msg, 
		value: this.request.body[param]
	};
	return new Validator(check);	
}

module.exports = koaValidator;