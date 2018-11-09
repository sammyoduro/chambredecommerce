const express          = require('express');
const router            = express.Router();
const db                  = require('../models/DatabaseSchema');
const bcrypt        = require('bcryptjs');


router.post('/',function (req,response) {
  var username = req.body.username;
  var newUsername = req.body.currentUsername;
  var userid = req.body.userid;
  // console.log(typeof(username));
  db.UsernameUpdate(userid,username,newUsername,userupdate=>{
    console.log(userupdate);
    response.send(JSON.stringify(userupdate));
  });

});
router.post('/pwrd',function (req,response) {
  var userid = req.body.userid;
  var currentpwrdParse = req.body.currentpwrdParse;
  var newpwrdParse = req.body.newpwrdParse;
  
  db.PasswordUpdate(userid,currentpwrdParse,newpwrdParse,passwordupdate=>{
    response.send(JSON.stringify(passwordupdate));
  });

});


module.exports = router;
