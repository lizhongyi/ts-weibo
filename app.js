var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let nunjucks = require('nunjucks');
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var bloger = require("./routes/bloger");
var pay = require("./routes/pay");
var goods = require("./routes/goods");
var order = require("./routes/order");
var api = require('./routes/api');
var session = require('express-session');
var axios = require("axios");
var app = express();
var moment = require("moment");


// view engine setup
nunjucks.configure('views', {
  autoescape: false,
  express: app,
  noCache: false
});
//设置默认模板引擎
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'hubwiz app', //secret的值建议使用随机字符串
  cookie: { maxAge: 60 * 1000 * 30 }, // 过期时间（毫秒）
  resave: false,
  saveUninitialized: true
}));

app.use('/', index);
app.use('/pay', pay);
app.use('/goods', goods);
app.use('/order', order);
app.use('/users', users);
app.use('/login', login);
app.use('/bloger', bloger);
app.use('/api', api);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
setInterval(function() {
  axios.get('http://127.0.0.1:3000/tszysmq').then(function(data) {
    console.log(data.data);
  });
}, 6000);
// error handler

console.log(moment().subtract(10, "hour").format("YYYY-MM-DD H:mm:ss"));
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;