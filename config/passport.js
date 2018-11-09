const LocalStrategy = require('passport-local').Strategy;
const db            = require('../models/DatabaseSchema');
const bcrypt        = require('bcryptjs');
const sqlite3       = require('sqlite3').verbose();
const pdb            = new sqlite3.Database('./database/sqlite3.db');

var pwrd;
module.exports = function(passport) {
  passport.use(new LocalStrategy(function (username,password,done) {
    db.Usersignin(username,getuser=>{
      if(getuser.status=='user not found'){
        return done(null,false,{message:'username not found'});
      }
      else if(!getuser){
        return done(null,false,{message:'username not found'});
      }
      for(var i = 0; i< getuser.length; i++){

        bcrypt.compare(password,getuser[i].password,function(err,isMatch) {
          if(err) throw err;

          if(isMatch){
            return done(null,getuser);
          }else{
            return done(null,false,{message:'password combination failed'});
          }


        });

        passport.serializeUser(function(user, done) {
          for(var i=0;i<user.length;i++){
            done(null, user[i].id);
          }

        });

        passport.deserializeUser(function (id,done) {
          pdb.get('SELECT * FROM Users WHERE id = ?',id,function(err,row){
            if(!row) return done(null,false);
            return done(null, row);
          });
        });
      }



    });

    }));
}
