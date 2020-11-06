var cookieParser = require('cookie-parser');
var express = require('express');
var logger = require('morgan');
var path = require('path');

var messageRouter = require("./routes/message");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/chat/api/messages', messageRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;