require('./config/config');
require('./models/db');
require('./config/passportConfig');
require('./controllers/user.controller');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const rtsIndex = require('./routes/index.router');
//const { serializeUser } = require('passport');

var app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);
app.use('/login',rtsIndex);
app.use('/userProfile', rtsIndex);


app.get('/auth/google',
  
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.email'] }));


app.get('/auth/google/ecokrypt', passport.authenticate('google', { failureRedirect: '/login' }),function(req, res){
  
     console.log("success login");
    
    
    res.end('User logged in successfully');
    // res.json(req.user);
    
  });
 
 app.get('/api',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json(req.user);
  });


// errorhandler;
// app.use((err, req, res, next) => {
//     if (err.name === 'ValidationError') {
//         var valErrors = [];
//         Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
//         res.status(422).send(valErrors)
//     }
//     else{
  
//         console.log(err);
//     }
// });

// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));