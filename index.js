/*jslint node: true */
'use strict';

var validator = require('validator');
var errors, pendingChecks;
var originalIsInt = validator.isInt;
validator.isInt = function(){
	pendingChecks.push({ check: this.check, method: originalIsInt });
};

function createError(param, msg, value){
	return { 
		param: param,
		msg: msg,
		value: value 
	};
}

function Validator(check){
	validator.check = check;
	return validator;
}

function koaValidator(options){
	return function *(next){
		errors = [];
		pendingChecks = [];
		this.checkQuery = checkQuery;
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

function validationErrors(){
	pendingChecks.forEach(function(rule){
		var check = rule.check;
		console.log('value', check.value);
		if (!rule.method(check.value)){
			errors.push({
				param: check.param,
				msg: check.msg,
				value: check.value
			});
		}
	});
	console.log('pendingChecks', pendingChecks);
	if (errors.length === 0) return null;
	return errors;
}

module.exports = koaValidator;