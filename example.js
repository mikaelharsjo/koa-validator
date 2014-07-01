var koa = require('koa');
var koaValidator = require('lib/koa-validator');
var app = koa();

// adding middleware extends Context with validation methods
app.use(koaValidator());

app.use(function *(){
  this.checkQuery('getparam', 'Invalid getparam').isInt();
  this.checkParams('urlparam', 'No url param').notEmpty();
  this.checkBody('postParam', 'Invalid postparam').isAlpha();
  var errors = this.validationErrors();
  yield errors if errors
  yield next;
});

app.listen(3000);
