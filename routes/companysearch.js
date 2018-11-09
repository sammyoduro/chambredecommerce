const express          = require('express');
const router            = express.Router();
const db                  = require('../models/DatabaseSchema');


//company search
router.get('/',function (request, response) {
  db.getCompanies(companies=>{
    response.render('companysearch',{
      companies:companies
    });
  });

});

router.post('/',function (req,response) {
  var searchItem = req.body.searchItem;

  db.companiesSearch(searchItem,searchCompany =>{
    if( searchCompany.length < 1 ){
      response.send({'status':false,'message':"no result's found"});
    }else{
      response.send({'status': true, 'companies' :searchCompany });
    }


  });

});

// mapview
router.get('/mapview/:id',function (request, response) {
  let id = request.params.id;

  db.displayMap(id,getmap=>{
   response.render('companysearch',{
     companies: getmap[1],
     getmap:getmap[0]
   });
 });

});
// users updates in company search routes
router.post('/updatesCompanies',function (req, res) {
  var cid = req.body.cid;
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
 if(errors.length > 0){

   for(var i=0; i<errors.length;i++){
       if( errors[i].msg === 'Raison Sociale is required'){raisonValidationErr = 'Raison Sociale is required';}
       if( errors[i].msg === 'Nom du Représentant is required'){rnameValidationErr = 'Nom du Représentant is required';}
       if( errors[i].msg === 'Localisation is required'){lcValidationErr = 'Localisation is required';}
       if( errors[i].msg === 'B.P is required'){bpValidationErr = 'B.P is required';}
       if( errors[i].msg === 'Telephone is required'){telValidationErr = 'Telephone is required';}
       if( errors[i].msg === 'N° Contribuable is required'){taxValidationErr = 'N° Contribuable is required';}

   }
   let secrepNames={cid,raison,rname,lc,bp,tel,email,tax,longitude,latitude}
   db.getCompanies(companies=>{
         res.render('dashboard',{
           companies:companies,
           user  :req.user,
           raisonValidationErr :raisonValidationErr,
           rnameValidationErr :rnameValidationErr,
           lcValidationErr:lcValidationErr,
           bpValidationErr:bpValidationErr,
           telValidationErr:telValidationErr,
           taxValidationErr:taxValidationErr,
           secrepNames: secrepNames

        });
       });

 }
 else{

        db.UpdateCompanies(raison,rname,lc,bp,tel,email,tax,longitude,latitude,cid,saveComapies=>{
          req.flash("seccess", raison +" "+saveComapies);
          res.redirect('/ccima.cm/staffroom/home');
        });
 }


});
module.exports = router;
