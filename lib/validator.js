var validator = require('validator');
var pendingChecks = [];
var errors = [];
var koaValidator = {}

//var originalIsInt = validator.isInt;
//validator.isInt = function(){
//	pendingChecks.push({ check: this.check, method: originalIsInt });
//};

function Validator(check){
	this.check = check;
	//return this;
}

function initialize(){
	pendingChecks = [];
	errors = [];
	attachValidators();
};

function attachValidators(){
	var sanitizers = ['trim', 'ltrim', 'rtrim', 'escape', 'whitelist', 'blacklist'];
	Object.keys(validator).forEach(function(methodName) {
		if (!methodName.match(/^to/) && sanitizers.indexOf(methodName) === -1) {
			console.log('methodName', methodName);
			Validator.prototype[methodName] = function(){
				pendingChecks.push({ check: this.check, method: validator[methodName] });
			};
		}
	});
	console.log('Validator.isInt', Validator.prototype)
}

function validationErrors(){
	console.log('pendingChecks', pendingChecks);
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