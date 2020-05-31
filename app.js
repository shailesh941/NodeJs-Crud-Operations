var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var documentRouter = require('./routes/document')
var contactusRouter = require('./routes/contactus')

var app = express();

mongoose.Promise = global.Promise;
var db = mongoose.connect(process.env.CON_URL || 'mongodb://localhost/nodedb', {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify:false
}).then(() =>  console.log('connection successful')).catch((err) => {
  console.log(err);
  process.exit();
});
//mongoose.set('useCreateIndex', true)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)


// view engine setup
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/products', productsRouter);
app.use('/documents', documentRouter);
app.use('/contact', contactusRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {


  if (err.name === 'ValidationError') {
      var valErrors = [];
      Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
      res.status(422).send(valErrors)
  }

  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
