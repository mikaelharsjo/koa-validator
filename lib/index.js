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

function createValidator(param, msg, value){
	var check = { 
		param: param, 
		msg: msg, 
		value: value
	};
	return new Validator(check);	
}

function checkQuery(param, msg){
	return createValidator(param, msg, this.query[param]);
}

function checkParams(param, msg){
	return createValidator(param, msg, this.url.split('/').slice(-1)[0]);	
}

function checkBody(param, msg){
	if (this.request.body) {
		return createValidator(param, msg, this.request.body[param]);	
	}
	return createValidator(param, msg, '');		
}

module.exports = koaValidator;