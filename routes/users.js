const express          = require('express');
const router            = express.Router();
const db                = require('../models/DatabaseSchema');
const randomstring      = require('randomstring');
const bcrypt            = require('bcryptjs')

// display dashboard after user successfully logged in

router.get('/',isLoggedIn,function (req,response) {

  db.getCompanies(companies=>{
      response.render('dashboard',{
        companies:companies,
        user  :req.user,
      });
    });
});
// route to middleware to make sure user is logged in
function isLoggedIn(req, res, next) {

    // if user is logged in -
    if (req.isAuthenticated()){
      return next();
    }else{
      // if they aren't redirected them to home
      res.redirect('/ccima.cm/staffroom/administrators/code100');
    }


}
// company search
router.post('/',isLoggedIn,function (req,response) {
  var searchItem = req.body.searchItem;

  db.companiesSearch(searchItem,searchCompany =>{
    if( searchCompany.length < 1 ){
      response.send({'status':false,'message':"no result's found"});
    }else{
      response.send({'status': true, 'companies' :searchCompany });
    }

  });

});

// register companies
router.get('/registerCompanies',isLoggedIn,function(req,res){
  res.render('reg_comp');

});
router.post('/registerCompanies',isLoggedIn,function(req,res){
 var raison = req.body.raison;
 var rname = req.body.rname;
 var lc = req.body.lc;
 var bp = req.body.bp;
 var tel = req.body.tel;
 var email = req.body.email;
 var tax = req.body.tax;
 var longitude = req.body.longitude;
 var latitude = req.body.latitude;

 var raisonValidationErr   = "";
 var rnameValidationErr    = "";
 var lcValidationErr       = "";
 var bpValidationErr       = "";
 var telValidationErr      = "";
 var taxValidationErr      = "";

 req.checkBody('raison','Raison Sociale is required').notEmpty();
 req.checkBody('rname','Nom du Représentant is required').notEmpty();
 req.checkBody('lc','Localisation is required').notEmpty();
 req.checkBody('bp','B.P is required').notEmpty();
 req.checkBody('tel','Telephone is required').notEmpty();
 req.checkBody('tax','N° Contribuable is required').notEmpty();
 let errors = req.validationErrors();

if(errors){
for(var i=0; i<errors.length;i++){
  if( errors[i].msg === 'Raison Sociale is required'){raisonValidationErr = 'Raison Sociale is required';}
  if( errors[i].msg === 'Nom du Représentant is required'){rnameValidationErr = 'Nom du Représentant is required';}
  if( errors[i].msg === 'Localisation is required'){lcValidationErr = 'Localisation is required';}
  if( errors[i].msg === 'B.P is required'){bpValidationErr = 'B.P is required';}
  if( errors[i].msg === 'Telephone is required'){telValidationErr = 'Telephone is required';}
  if( errors[i].msg === 'N° Contribuable is required'){taxValidationErr = 'N° Contribuable is required';}
}
let repNames = {raison,rname,lc,bp,tel,email,tax,longitude,latitude}
  res.render('reg_comp',{
    user  :req.user,
    raisonValidationErr :raisonValidationErr,
    rnameValidationErr :rnameValidationErr,
    lcValidationErr:lcValidationErr,
    bpValidationErr:bpValidationErr,
    telValidationErr:telValidationErr,
    taxValidationErr:taxValidationErr,
    repNames : repNames

  });
}else{
  db.InsertCompanies(raison,rname,lc,bp,tel,email,tax,longitude,latitude,onComplete=>{
    if(onComplete == "success"){
      req.flash("seccess", raison + "has been registered successfully");
      res.redirect('/ccima.cm/staffroom/home');
    }else{
      req.flash("seccess", raison + "has already been registered");
      res.render('reg_comp',{user  :req.user});

    }
  });
}

});

// update companies
router.get('/registerCompanies',isLoggedIn,function(req,res){
  res.render('reg_comp');

});
// delete companiesSearch
router.get('/delete/:id',function (req,res) {
  let id = req.params.id;
  db.deleteCompany(id,deleted=>{
    req.flash("seccess", "company deleted successfully");
    res.redirect('/ccima.cm/staffroom/home');
  });

});
// Delete user
router.get('/deleteUser/:id',isLoggedIn,function (req,res) {
  let id = req.params.id;
  console.log(id);
  db.deleteUser(id,delUser=>{
    req.flash("seccess", "User deleted successfully");
    res.redirect('/ccima.cm/staffroom/home/registered_users');
  });

});

// navigate to user settings on dashboard
router.get('/users',isLoggedIn,function (req,response) {
    db.getUsers(users=>{
    response.render('reg_user',{
      user  :req.user,
      users:users
    });
  });
});
// list all Users
router.get('/registered_users',isLoggedIn,function (req,response) {
    db.getUsers(users=>{
    response.render('users',{
      user  :req.user,
      users:users
    });
  });
});

router.get('/registered_users/reg/',isLoggedIn,function(req,res){
  var fullname = req.query.fname + " "+ req.query.lname;
  var username = req.query.username;
  var password = req.query.password;
  // var users    = req.query.users;
  var verified = req.query.verified;
  var user    = req.query.user;

  db.getUsers(users=>{
  res.render('users',{
    fullname: fullname,
    username: username,
    password: password,
    users: users,
    verified: verified,
    user  : req.user,
    });
  });


});


// Register new users
var fname           = '';
var lname           = '';
var title           = '';
var rawuser_concat  = '';
var username        = '';
var password        = '';
var company         = '';
var adminType       = '';
var pnum            = '';
var email           = '';

router.post('/users',isLoggedIn,function (request,response) {

 fname = request.body.fname;
 lname = request.body.lname;
 title = request.body.title;
 rawuser_concat = fname.substring(0,2);
 username = randomstring.generate(5);
 password = randomstring.generate(8);
 company = request.body.company;
 adminType = request.body.adminType;
 pnum = request.body.pnum;
 email = request.body.email;

var fnameValidationErr;
var lnameValidationErr="";
var TitleValidationErr="";
var CompanyValidationErr="";
var pnumValidationErr = "";
var EmailValidationErr="";
var nEmailValidationErr="";
// validate input fields
request.checkBody('fname','First name is required').notEmpty();
request.checkBody('lname','Last name is required').notEmpty();
request.checkBody('title','Title is required').notEmpty();
request.checkBody('company','Company name is required').notEmpty();
request.checkBody('pnum','phone number is required').notEmpty();
request.checkBody('email','Email is required').notEmpty();
request.checkBody('email','Email is not valid').isEmail();

let errors = request.validationErrors();
if(errors){
for(var i=0; i<errors.length;i++){
    if( errors[i].msg === 'First name is required'){fnameValidationErr = 'first name is required';}
    if( errors[i].msg === 'Last name is required'){lnameValidationErr = 'lirst name is required';}
    if( errors[i].msg === 'Title is required'){TitleValidationErr = 'Title is required';}
    if( errors[i].msg === 'Company name is required'){CompanyValidationErr = 'Company name is required';}
    if( errors[i].msg === 'phone number is required'){pnumValidationErr = 'phone number is required';}
    if( errors[i].msg === 'Email is required'){EmailValidationErr = 'Email is required';}
    if( errors[i].msg === 'Email is not valid'){nEmailValidationErr = 'Email is not valid';}

}
db.getUsers(users=>{
response.render('reg_user',{
  fnameValidationErr  : fnameValidationErr,
  lnameValidationErr  : lnameValidationErr,
  TitleValidationErr  : TitleValidationErr,
  CompanyValidationErr: CompanyValidationErr,
  pnumValidationErr: pnumValidationErr,
  EmailValidationErr  : EmailValidationErr,
  nEmailValidationErr : nEmailValidationErr,
  fname     : fname,
  lname     : lname,
  title     : title,
  company   : company,
  pnum      : pnum,
  email     : email,
  users:users,
  user  :request.user,
});
});
return;

}else{
// hash password
bcrypt.genSalt(10,function (err,salt) {
  bcrypt.hash(password,salt,function(err,hash){
    if(err){
      throw err;
      return;
    }else{
      var securedpassword = hash; //secured password
      db.RegisterNewUsers(fname,lname,title,username,securedpassword,company,adminType,pnum,email,userAuth=>{
        response.redirect('/ccima.cm/staffroom/home/registered_users/reg/?fname='+fname+'&lname='+lname+'&username='+username+'&password='+password+'&users='+userAuth+'&verified=verified&user='+request.user);
      });
    }
  });
});

}
});


module.exports = router;
