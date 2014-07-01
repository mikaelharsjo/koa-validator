var koa = require('koa');
var bodyParser = require('koa-body-parser');
var koaValidator = require('./lib');
var app = koa();

// body needs to be parsed before using checkBody
app.use(bodyParser());

// adding middleware extends Context with validation methods
app.use(koaValidator());

app.use(function *(next){
	this.checkQuery('getparam', 'Invalid getparam').isInt().notEmpty();
	this.checkParams('urlparam', 'No url param').notEmpty();
	this.checkBody('postParam', 'Invalid postparam').isAlpha();
	var errors = this.validationErrors();
	if (errors) {
		this.body = errors
	}
	else {
		this.body = 'No validation errors'
	}

	yield next;
});

app.listen(3000);
