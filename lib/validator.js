var validator = require('validator');
var pendingChecks = [];
var koaValidator = {};

function Validator(check){
	this.check = check;
}

Validator.prototype.notEmpty = function(){
	var notEmpty = function(){
		if (this.check.value === undefined) return true;
		return this.check.value.toString().length !== 0;
	};
	pendingChecks.push({ check: this.check, method: notEmpty });
	return this;
};

function initialize(){
	pendingChecks = [];
	attachValidators();
}

function attachValidators(){
	var sanitizers = ['trim', 'ltrim', 'rtrim', 'escape', 'whitelist', 'blacklist'];
	Object.keys(validator).forEach(function(methodName) {
		if (!methodName.match(/^to/) && sanitizers.indexOf(methodName) === -1){
			Validator.prototype[methodName] = function(){
				pendingChecks.push({ check: this.check, method: validator[methodName] });
				return this;
			};
		}
	});
}

function validationErrors(){
	var errors = [];

	pendingChecks.forEach(function(rule){
		var check = rule.check;
		if (!rule.method(check.value)){
			errors.push({
				param: check.param,
				msg: check.msg,
				value: check.value
			});
		}
	});
	if (errors.length === 0) return null;

	return errors;
}

module.exports.Validator = Validator;
module.exports.initialize = initialize;
module.exports.validationErrors = validationErrors;