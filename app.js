var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// passport references for auth
var passport = require('passport')
var session = require('express-session')

// add mongoose for db connection
var mongoose = require('mongoose')


var usersController = require('./controllers/users');
// add reference to our new foods controller
var foodsController = require('./controllers/foods')
var countriesController = require('./controllers/countries')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// db connection
var globals = require('./config/globals')

mongoose.connect(globals.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    (res) => {
        console.log('Connected to MongoDB')
    }
).catch(() => {
    console.log('Connection to MongoDB failed')
})

// passport auth config
// 1. set app to manage sessions
app.use(session({
    secret: 'w20@globalfoodString',
    resave: true,
    saveUninitialized: false
}))

// 2. initialize passport
app.use(passport.initialize())
app.use(passport.session())

// 3. link passport to the User model
var User = require('./models/user')
passport.use(User.createStrategy())

// 4. set up passport to read/write user data to/from the session object
// passport.deserializeUser(User.deserializeUser())
// passport.serializeUser(User.serializeUser())
var googleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new googleStrategy({
        clientID: globals.ids.google.clientID,
        clientSecret: globals.ids.google.clientSecret,
        callbackURL: globals.ids.google.callbackURL
    },
    (token, tokenSecret, profile, done) => {
        User.findOne({oauthID: profile.id}, (err, user) => {
            if(err) {
                console.log(err)
            }
            if (!err && user!== null) {
                done(null, user)
            }
            else {
                //User does not exist, create user from this google profile
                user = new User({
                    username: profile.displayName,
                    oauthID: profile.id,
                    oauthProvider: "Google",
                    created: Date.now()
                })
                user.save((err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        done(null, user)
                    }
                })
            }
        })
    }
))

//Facebook login
var facebookStrategy = require('passport-facebook').Strategy;
passport.use(new facebookStrategy({
    clientID: globals.ids.facebook.clientID,
    clientSecret: globals.ids.facebook.clientSecret,
    callbackURL: globals.ids.facebook.callbackURL
}, 
    (accessToken, refreshToken, profile, done) => {
        //check if the user exists in mongo
        User.findOne({oauth: profile.id}, (err, user) => {
            if (err) {
                console.log(err);
            }
            //User already exists in DB
            if (!err && user != null) {
                done(null, user);
            }
            else {
                user = new User({
                    username: profile.displayName,
                    oauthID: profile.id,
                    oauthProvider: "Facebook",
                    created: Date.now()
                })
                user.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        done(null, user);
                    }
                })
            }
        })
    }
))


passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (er, user) => {
        if (!err) {
            done(null, user);
        }
        else {
            done(err, null);
        }
    })
})

var indexController = require('./controllers/index');
app.use('/', indexController);

// map any urls starting with /foods to be handled by the foods controller
app.use('/foods', foodsController)
app.use('/countries', countriesController)



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
