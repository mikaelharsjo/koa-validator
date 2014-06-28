var validator = require('validator');
var pendingChecks = [];
var errors = [];

var sanitizers = ['trim', 'ltrim', 'rtrim', 'escape', 'whitelist', 'blacklist'];
Object.keys(validator).forEach(function(methodName) {
	if (!methodName.match(/^to/) && sanitizers.indexOf(methodName) === -1) {
		console.log('methodName', methodName);
	}
});

var originalIsInt = validator.isInt;
validator.isInt = function(){
	pendingChecks.push({ check: this.check, method: originalIsInt });
};

function Validator(check){
	validator.check = check;
	return validator;
}

function initialize(){
	pendingChecks = [];
	errors = [];
};

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

module.exports.Validator = Validator;
module.exports.initialize = initialize;
module.exports.validationErrors = validationErrors;