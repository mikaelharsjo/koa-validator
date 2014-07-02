var koa = require('koa');
var bodyParser = require('koa-body-parser');
var request = require('supertest');
var expect = require('expect.js');
var koaValidator = require('../lib');
var app;

describe('koa-validator', function(){
	beforeEach(function(done){
		app = koa();
		app.use(koaValidator());
		done();
	});

	describe('attaches', function(){
		it('checkQuery to Context and req', function(done){
			app.use(function *(next){
				expect(this.checkQuery).to.be.a('function');
				expect(this.req.checkQuery).to.be.a('function');
				yield next;
			});

			request(app.listen())
			 	.get('/')
			 	.end(done);
		});

		it('checkParams to Context and req', function(done){
			app.use(function *(next){
				expect(this.checkParams).to.be.a('function');
				expect(this.req.checkParams).to.be.a('function');
				yield next;
			});

			request(app.listen())
			 	.get('/')
			 	.end(done);
		});

		it('checkBody to Context and req', function(done){
			app.use(function *(next){
				expect(this.checkBody).to.be.a('function');
				expect(this.req.checkBody).to.be.a('function');
				yield next;
			});

			request(app.listen())
			 	.get('/')
			 	.end(done);
		});
	});

	describe('checkQuery', function(done){
		it('detects invalid query params', function(done){
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

		it('detects multiple errors', function(done){
			app.use(function *(next){
				this.checkQuery('param1', 'Valid getparam').isInt();
				this.checkQuery('param2', 'Not a numeric value').isInt();
				var errors = this.validationErrors();
				expect(errors.length).to.equal(2);
				yield next;
			});

			request(app.listen())
			 	.get('/test?param1=abc&param2=test')
			 	.end(done);
		});

		it('supports all validators', function(done){
			app.use(function *(next){
				this.checkQuery('param2', 'Not alpha').isAlpha();
				this.checkQuery('param3', 'Not null').isNull();
				var errors = this.validationErrors();
				expect(errors.length).to.eql(2);
				yield next;
			});

			request(app.listen())
			 	.get('/test?param1=&param2=123&param3=something')
			 	.end(done);
		});

		it('supports notEmpty', function(done){
			app.use(function *(next){
				this.checkQuery('param1', 'Empty').notEmpty();
				var errors = this.validationErrors();
				expect(errors.length).to.eql(1);
				yield next;
			});

			request(app.listen())
			 	.get('/test?param1=')
			 	.end(done);
		});

		it('supports chaining', function(done){
			app.use(function *(next){
				this.checkQuery('param1', 'Empty').notEmpty().isAlpha();
				this.checkQuery('param1', 'Empty').isInt().isEmail();
				var errors = this.validationErrors();
				expect(errors.length).to.eql(4);
				yield next;
			});

			request(app.listen())
			 	.get('/test?param1=&param2=abc')
			 	.end(done);			
		});
	});

	describe('checkParams', function(done){
		it('is available to middleware downstream', function(done){
			app.use(function *(next){
				expect(this.checkParams).to.be.a('function');
				yield next;
			});

			request(app.listen())
			 	.get('/')
			 	.end(done);
		});

		it('detects errors', function(done){
			app.use(function *(next){
				this.checkParams('urlparam', 'Invalid urlparam').isAlpha();
				var errors = this.validationErrors();
				expect(errors.length).to.equal(1);
				yield next;
			});

			request(app.listen())
			 	.get('/test/123')
			 	.end(done);			
		});

		it('handles url without params', function(done){
			app.use(function *(next){
				this.checkParams('urlparam', '').isAlpha();
				var errors = this.validationErrors();
				expect(errors.length).to.equal(1);
				yield next;
			});

			request(app.listen())
			 	.get('/')
			 	.end(done);			
		});
	});

	describe('checkBody', function(done){
		it('detects errors', function(done){
			app.use(bodyParser());

			app.use(function *(next){
				this.checkBody('postParam', '').isAlpha();
				var errors = this.validationErrors();
				expect(errors.length).to.equal(1);
				yield next;
			});

			request(app.listen())
			 	.post('/')
			 	.send({ postParam: 123 })
			 	.end(done);			
		});
	});
});