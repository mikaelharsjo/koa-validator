var koa = require('koa');
var router = require('koa-router');
var request = require('supertest');
var expect = require('expect.js');
var koaValidator = require('..');
var app;

describe('koa-validator()', function(){
	beforeEach(function(done){
		app = koa();
		app.use(koaValidator());
		done();
	});

	describe('checkQuery', function(done){
		it('is available to middleware downstream', function(done){
			app.use(function *(next){
				expect(this.checkQuery).to.be.a('function');
				yield next;
			});

			request(app.listen())
			 	.get('/')
			 	.end(done);
		});

		it('can detect invalid query params', function(done){
			app.use(function *(next){
				this.checkQuery('getparam', 'Invalid getparam').isInt();
				var errors = this.validationErrors();
				expectedErrors = [{ param: 'getparam', msg: 'Invalid getparam', value: '1ab' }];
				expect(errors[0]).to.eql(expectedErrors[0]);
				yield next;
			});

			request(app.listen())
			 	.get('/test?getparam=1ab')
			 	.end(done);
		});

		it('does not report errors when query is valid', function(done){
			app.use(function *(next){
				this.checkQuery('getparam', 'Valid getparam').isInt();
				var errors = this.validationErrors();
				expect(errors).to.eql(null);
				yield next;
			});

			request(app.listen())
			 	.get('/test?getparam=1')
			 	.end(done);
		});

		it('handles multiple checks', function(done){
			app.use(function *(next){
				this.checkQuery('param1', 'Valid getparam').isInt();
				this.checkQuery('param2', 'Not a numeric value').isInt();
				this.checkQuery('param3', 'invalid getparam').isInt();
				var errors = this.validationErrors();
				expectedErrors = [{ param: 'param2', msg: 'Not a numeric value', value: 'test' }];
				expect(errors[0]).to.eql(expectedErrors[0]);
				yield next;
			});

			request(app.listen())
			 	.get('/test?param1=1&param2=test&param3=3')
			 	.end(done);
		});
	});
});