var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

///
var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyUSB0', {
  parser: SerialPort.parsers.readline('\n')
});

var pfio = require('piface-node');
pfio.init();

var splitT;
var status = 0;

//Input Data (Lidar Sensor)
port.on('data', function (data) {
  if(status == 1) return;

  if(data!=""){
    splitT = data.split('/');

    if(splitT[0] < 150){
      status = 1;
      pfio.digital_write(0,1);      

      setTimeout(function(){
        status = 0;
      }, 3000);
    }
    else{
      status = 0;
      pfio.digital_write(0,0);
    }
//    console.log(splitT[0]);
  }
});

port.on('open', function(){  
  port.write('main screen turn on', function(err){
    if(err){
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });
});
///

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

///
var lidarRouter = require('./routes/lidar');
var macCheckRouter = require('./routes/macCheck');
///

var app = express();

// view engine setup
console.log(path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));
//app.set('views', './views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
//app.set('view engine', 'jade');

app.listen(3000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

///
app.use('/lidar', lidarRouter);
app.use('/macCheck', macCheckRouter);
///

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
