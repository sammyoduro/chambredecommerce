const express          = require('express');
const router            = express.Router();
const db                = require('../models/DatabaseSchema');
const passport          = require('passport');
const nodemailer        = require('nodemailer');
const randomstring      = require('randomstring');
const bcrypt            = require('bcryptjs');


//login Route
router.get('/',function (req,res) {
  res.render('index');
});

// login Process
router.post('/',function (req,res,next) {

  passport.authenticate('local',function (err,user,info) {
    // console.log(user);
    if (err) throw err;
    if(!user){
      req.flash("seccess","incorrect username or password");
      res.redirect('/ccima.cm/staffroom/administrators/code100');
    }else{
      req.login(user,function (error) {
        if(error) return next(error);
        res.redirect('/ccima.cm/staffroom/home');

      });
    }
  //

  })(req, res, next);
});

// send mail
router.post('/mailto',function (req,res) {
  var email = req.body.email;
  var gen_token = randomstring.generate(20);
  db.retrieveLostPassword(email,gen_token,getDetails =>{
    for(let i=0;i<getDetails.length;i++){
      SendMail(email,getDetails[i].username,getDetails[i].gentoken);
    }

    // SendMail(email,getDetails);
  });
});

function SendMail(email,username,token) {
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ladysally2016@gmail.com',
    pass: 'congratulations12'
  }
});

var mailOptions = {
  from: "ladysally2016@gmail.com",
  to: email,
  subject: "Username and Password Recovery",
  html: '<p>Click on the link to reset your password, Username: ' + username +', Click <a href="http://localhost:3000/ccima.cm/staffroom/administrators/code100/resetPassword/?token='+token+'">here</a> to reset your password</p>',

};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}

// reset user Password
router.get('/resetPassword',function (req,res) {
  var gettoken = req.query.token;
  res.render('password_reset',{gettoken:gettoken});

});
// password recovery
router.post('/recovery',function (req,res) {
  var token = req.body.token;
  var npwrd = req.body.npwrd;

  bcrypt.genSalt(10,function (err,salt) {
    bcrypt.hash(npwrd,salt,function(err,hash){
      if(err){
        throw err;
        return;
      }else{
        var securedpassword = hash; //secured password
        db.RestoreLostPassword(token,securedpassword,getDetails =>{
          res.send({'status' :getDetails });
        });
      }
    });
  });
});
module.exports = router;
