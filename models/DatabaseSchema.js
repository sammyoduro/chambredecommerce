const sqliteJson    = require('sqlite-json');
const sqlite3       = require('sqlite3').verbose();
const db            = new sqlite3.Database('./database/sqlite3.db');
const exporter      = sqliteJson(db);
var dateFormat      = require('dateformat');
const bcrypt        = require('bcryptjs');
var async = require('async');

const initialize = () => {

   db.run("CREATE TABLE if not exists Companies (id INTEGER PRIMARY KEY AUTOINCREMENT,raison TEXT,representative_name TEXT,location TEXT,bp TEXT,tel TEXT,email TEXT NULL,tax_number TEXT,longitude TEXT NULL,latitude TEXT NULL,creation_date TEXT)");
   db.run("CREATE TABLE if not exists Users (id INTEGER PRIMARY KEY AUTOINCREMENT,fname TEXT,lname TEXT,title TEXT,username TEXT,password TEXT,CompanyName TEXT,Admintype TEXT,pnumber TEXT,email TEXT,creation_date TEXT,mytoken TEXT)");
}
/*-----------------
 register new Users
 ------------------*/
const RegisterNewUsers = (fname,lname,title,username,securedpassword,company,adminType,pnum,email,userAuth) => {
  var creation_date = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");


    db.exec(`INSERT INTO Users(fname,lname,title,username,password,CompanyName,Admintype,pnumber,email,creation_date ) VALUES ("${fname}", "${lname}", "${title}", "${username}", "${securedpassword}", "${company}", "${adminType}", "${pnum}", "${email}", "${creation_date}")`, (err) => {
        if (err) {
            throw new Error(err);
        }

        console.log("User has been added successfully");
    });
    db.all('SELECT * FROM Users ORDER BY id DESC', (err, parseusers) => {
        if (err) {
            throw new Error(err);
        }
        // console.log(parseusers);
        return userAuth(parseusers);
    });
}
// Get all Users
const getUsers = (users) => {
    db.all('SELECT * FROM Users ORDER BY id DESC', (err, parseusers) => {
        if (err) {
            throw new Error(err);
        }
        return users(parseusers);
    });
}
/*------------------
      LOGIN
--------------------*/
const Usersignin = (username,getuser)=>{


  db.all('SELECT * FROM Users WHERE username=$username',{$username:username},(err,user)=>{
    if (err) {
        throw new Error(err);
    }
    // console.log(user.length);
      if (user.length < 1) {
        return getuser({'status':'user not found'});
      }else{
        return getuser(user);
      }

  });
}
// restore password
const RestoreLostPassword=(token,securedpassword,getDetails)=>{
  var popdata = [securedpassword,token];
  db.all("UPDATE `Users` SET password=?  WHERE mytoken=?",popdata,(err,updated) => {
      if (err) {
          throw new Error(err);
      }

        return getDetails("Password updated successfully! login with your new credentials");


  });
}
// insert into companies
const InsertCompanies = (raison,rname,lc,bp,tel,email,tax,longitude,latitude,onComplete) => {
  var creation_date = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    async.parallel([
        function(callback) {
            db.all('SELECT * FROM Companies WHERE tax_number = $tax',{$tax:tax},(err,company)=>{
                if (err) {
                    return callback(err);
                }
                if(company.length > 0){
                  return callback(null, "no pass");
                }else{
                  return callback(null, "pass");
                }

            });
        },
    ], function(error, callbackResults) {
        if (error) {
            //handle error
            console.log(error);
        }
        if(callbackResults == "no pass"){
          return onComplete("no pass");
        }else{
          db.exec(`INSERT INTO Companies(raison,representative_name,location,bp,tel,email,tax_number,longitude,latitude ,creation_date ) VALUES ("${raison}", "${rname}", "${lc}", "${bp}", "${tel}", "${email}", "${tax}", "${longitude}", "${latitude}", "${creation_date}")`, (err) => {
              if (err) {
                  throw new Error(err);
              }

              return onComplete("success");

          });
        }
    });
}
/*--------------------
    update companies
----------------------*/
const UpdateCompanies = (raison,rname,lc,bp,tel,email,tax,longitude,latitude,cid,saveComapies)=>{
var cupdate = [raison,rname,lc,bp,tel,email,tax,longitude,latitude,cid];
  db.run("UPDATE Companies SET raison=?, representative_name=?, location=?, bp=?, tel=?, email=?, tax_number=?, longitude=?, latitude=?  WHERE id=?",cupdate,(err,updated)=>{
    if(err) throw err;
    return saveComapies('Company has been updated successfully');
  });

}
/*---------------------
search Companies
----------------------*/
const companiesSearch  = (searchItem,searchCompany)=>{

//oh $item is interploration? i am passing searchitem to item o i can concatinate before search
  db.all('SELECT * FROM Companies WHERE raison LIKE $item OR location LIKE $item',{$item:'%'+searchItem+'%'}, (err, Companies) => {
      if (err) {
          throw new Error(err);
      }
      return searchCompany(Companies);
  });
}
const getCompanies = (onGet) => {
    db.all('SELECT * FROM Companies', (err, Companies) => {
        if (err) {
            throw new Error(err);
        }

        return onGet(Companies);
    });
}
function displayMap (id,getmap){

  async.parallel([
      function(callback) {
          db.all('SELECT * FROM Companies WHERE id = $id',{$id:id},(err,details)=>{
              if (err) {
                  return callback(err);
              }
              return callback(null, details);
          });
      },
      function(callback) {
          db.all('SELECT * FROM Companies ORDER BY id DESC', (err, Companies) => {
              if (err) {
                  return callback(err);
              }
              return callback(null, Companies);
          });
      }
  ], function(error, callbackResults) {
      if (error) {
          //handle error
          console.log(error);
      } else {

          return getmap(callbackResults);
      }
  });
}
const getAllCompaniesMap = (onGet) => {
    db.all('SELECT * FROM Companies', (err, Companies) => {
        if (err) {
            throw new Error(err);
        }

        return onGet(Companies);
    });
}


// delete company
const deleteCompany = (del_com_id,deleted) => {
  db.all('DELETE FROM Companies WHERE id = $id',{$id:del_com_id},(err,response)=>{
    if (err) {
        throw new Error(err);
    }
    return deleted("Company has been deleted successfully");



  });
}
/*------------------
      SETTINGS
--------------------*/
// username
const UsernameUpdate = (userid,username,newUsername,userupdate)=>{

  async.parallel([
      function(callback) {
          db.all('SELECT * FROM Users WHERE username=$username',{$username:username},(err,user)=>{
              if (err) {
                  return callback(err);
              }
              if(user.length < 1){
                return callback(null, "no pass");
              }else{
                return callback(null, "pass");
              }

          });
      },
  ], function(error, callbackResults) {
      if (error) {
          //handle error
          console.log(error);
      }
      if(callbackResults == "no pass"){
        return userupdate("Username is incorrect");
      }else{
          // sub async
          async.parallel([
              function(callback) {
                  db.all('SELECT * FROM Users WHERE username=$newUsername',{$newUsername:newUsername},(err,user)=>{
                      if (err) {
                          return callback(err);
                      }
                      if(user.length < 1){
                        return callback(null, "pass");
                      }else{
                        return callback(null, "no pass");
                      }

                  });
              },
          ], function(error, callbackResults) {
              if (error) {
                  //handle error
                  console.log(error);
              }
              if(callbackResults == "pass"){
                var popdata = [newUsername,userid];
                console.log(popdata);
                db.all("UPDATE Users SET username=?  WHERE id=?",popdata,(err,updated) => {
                    if (err) {
                        throw new Error(err);
                    }
                  return userupdate("Username updated successfully");
                });

              }else{
                   return userupdate("Sorry username already taken");
              }
          });

        //end of sub async
      }
  });
}
// password
const PasswordUpdate = (userid,currentpwrdParse,newpwrdParse,passwordupdate)=>{

  async.parallel([
      function(callback) {
          db.all('SELECT * FROM Users WHERE id=$userid',{$userid:userid},(err,user)=>{
              if (err) {
                  return callback(err);
              }
              for(var i = 0; i < user.length; i++){

                bcrypt.compare(currentpwrdParse,user[i].password,function(err,isMatch) {
                  if(err) throw err;

                  if(isMatch){
                    return callback(null, "pass");;
                  }else{
                    return callback(null, "no pass");
                  }


                });
              }
          });
      },
  ], function(error, callbackResults) {
      if (error) {
          //handle error
          console.log(error);
      }
      if(callbackResults == "no pass"){
        return passwordupdate("password is incorrect");
      }
      else{
        bcrypt.genSalt(10,function (err,salt) {
          bcrypt.hash(newpwrdParse,salt,function(err,hash){
            if(err){
              throw err;
              return;
            }else{
              var securedpassword = hash;
              var popdata = [securedpassword,userid];
              console.log(popdata);
              db.all("UPDATE Users SET password=?  WHERE id=?",popdata,(err,updated) => {
                  if (err) {
                      throw new Error(err);
                  }
                return passwordupdate("Password updated successfully");
              });
            }
          });
        });
      }
  });
}
const retrieveLostPassword = (email,gen_token,getDetails)=>{
  let username;
  async.parallel([
      function(callback) {
          db.all("SELECT * FROM Users WHERE email = $email",{$email:email},(err,detail)=>{
              if (err) {
                  return callback(err);
              }
              if(detail.length < 1){
                return callback(null, "no pass");
              }else{
                for(let i =0;i<detail.length;i++){
                  console.log();
                  let userDetails ={'username':detail[i].username,'gentoken':gen_token};
                  return callback(null, userDetails);
                }

              }

          });
      },
  ], function(error, callbackResults) {
      if (error) {
          //handle error
          console.log(error);
      }
      if(callbackResults == "no pass"){
        return getDetails("email id not recognized");
      }else{
        var popdata = [gen_token,email];
        db.all("UPDATE Users SET mytoken=?  WHERE email=?",popdata,(err,updated) => {
            if (err) {
                throw new Error(err);
            }
          return getDetails(callbackResults);
        });
      }
  // db.all("SELECT fname,lname,username,password,email FROM Users WHERE email=$email",{$email:email},(err,detail)=>{
  //   if(err){
  //     throw new Error(err);
  //   }
  //   if (detail.length < 1) {
  //     return getDetails('email not found');
  //   }else{
  //     return getDetails(detail);
  //   }
  //
});
}

// delete user
const deleteUser = (del_user_id,delUser) => {
  db.all('DELETE FROM Users WHERE id = $id',{$id:del_user_id},(err,response)=>{
    if (err) {
        throw new Error(err);
    }
    return delUser("User has been deleted successfully");



  });
}

module.exports = {
  initialize,
  getUsers,
  retrieveLostPassword,
  RestoreLostPassword,
  UsernameUpdate,
  PasswordUpdate,
  InsertCompanies,
  UpdateCompanies,
  RegisterNewUsers,
  Usersignin,
  displayMap,
  getCompanies,
  companiesSearch,
  getAllCompaniesMap,
  deleteCompany,
  deleteUser
}
