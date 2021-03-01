const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const {serializeUser} = require('passport');
const{deserializeUser}= require('passport');

// const BearerStrategy = require('passport-local').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const findOrCreate =require('mongoose-findorcreate');
var User = mongoose.model('User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



passport.use(new GoogleStrategy({
    clientID: '937306526779-tfcdub2idqtnede9tt3899ub2a550cqt.apps.googleusercontent.com',
    clientSecret:'js7LxJXx38w7Kie6_l6D860P',
    callbackURL: "http://localhost:3000/auth/google/ecokrypt",
    //userProfileURL:"https://www.googleapis.com/auth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile,done) {
   console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
      
    });
  }
));

passport.use(
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {
            User.findOne({ email: username },
                (err, user) => {
                    if (err)
                        return done(err);
                    // unknown user
                    else if (!user)
                        return done(null, false, { message: 'Email is not registered' });
                    // wrong password
                    else if (!user.verifyPassword(password))
                        return done(null, false, { message: 'Wrong password.' });
                    // authentication succeeded
                    else
                        return done(null, user);
                });
        })
);

// passport.use(new BearerStrategy(
//     function(username, done) {
//       User.findOne({ email: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user)
//          { return done(null, false, {message:'Email is not registered'})};
//         return done(null, user, { scope: 'read' });
//       });
//     }
//   ));