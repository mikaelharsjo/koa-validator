/*jslint node: true */
'use strict';

var validator = require('./validator');

function createError(param, msg, value){
	return { 
		param: param,
		msg: msg,
		value: value 
	};
}

function koaValidator(options){
	return function *(next){
		//errors = [];
		//	pendingChecks = [];
		validator.initialize();
		this.checkQuery = checkQuery;
		this.validationErrors = validator.validationErrors;

		yield next;
	};
}

function checkQuery(param, msg){
	var check = { 
		param: param, 
		msg: msg, 
		value: this.query[param]
	};
	return new validator.Validator(check);
}

module.exports = koaValidator;