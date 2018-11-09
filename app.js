const express             = require('express');
const expressValidator    = require('express-validator');
const flash               = require('connect-flash');
const session             = require('express-session');
const passport            = require('passport');
const path                = require('path');
const db                  = require('./models/DatabaseSchema');
const bodyParser          = require('body-parser');
const cookieParser        = require('cookie-parser')


//init App
const app = express();

//Load View Engine
app.set('views',path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

//Set Public folder
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser('ilovemathematics'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// Epress session middleware
app.use(session({
  secret: 'gksljgdggsugnsuyeousnvsot',
  name: 'key',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('*',function (req,res,next) {
  res.locals.user = req.user || null;
next();

});
// express mesages middleware
app.use(require('connect-flash')());
app.use(function (req,res,next) {
res.locals.messages = require('express-messages')(req,res);
next();
});
// prevent reauthentication
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
//Body parder middleware
app.use(expressValidator({
  errorFormatter: function (param,msg,value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while (namespace.length) {
      formParam+='[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };

  }
}));

// Passport Config
require('./config/passport')(passport);
// passport middleware

//login Route
app.get('/ccima.cm/staffroom/administrators/code100',function (req,res) {
  res.render('index');
});
// user logout
app.get('/logout',function(req,res){
  req.session.destroy(function (err) {
    if(err) throw err;
    res.redirect('/ccima.cm/staffroom/administrators/code100');

  });
});


//Routes files
let users = require('./routes/users');
let login = require('./routes/login');
let companysearch = require('./routes/companysearch');
let settings = require('./routes/settings');

app.use('/ccima.cm/staffroom/administrators/code100',login);
app.use('/ccima.cm/staffroom/home',users);
app.use('/ccima.cm/searchCompanies',companysearch);
app.use('/ccima.cm/staffroom/settings',settings);
app.use(function(req,res){
    res.render('error_page');
});


//Start server
app.listen(3000,function () {
  console.log('Server started on port 3000...');
})
