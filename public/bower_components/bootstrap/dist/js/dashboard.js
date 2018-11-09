function toggleNav() {
var page =  document.getElementById('page-header').innerHTML;
}

function userVerificarionModal() {
  var userverified = document.getElementById('userverified').innerHTML;
  if(userverified.length>0){
    $("#myModal").modal();
  }
  //fix it later it is throuwing erros.
}


function companySearch() {
  var companysearch = document.getElementById("companyserarchfield");
  var datatoggle = companysearch.value;
  var data = {searchItem: companysearch.value};

    if(datatoggle.length<1){
      $( "#output" ).addClass( "hidden" );
      $( "#tablemain" ).removeClass( "hidden" );
      $("#searchresult").addClass("hidden");
    }else{
      $( "#output" ).removeClass( "hidden" );
      $( "#tablemain" ).addClass( "hidden" );
      $("#searchresult").removeClass("hidden");
    }

  $.ajax({
    type        : 'post',
    data        : data,
    dataType    : 'json',
    url         : '/chamberedecommerce.com/staffroom/home',
    success     : function(data){
      if(!data.status){
        document.getElementById('searchresult').innerHTML = "<strong>Search results for: </strong>"+ datatoggle;
        document.getElementById('output').innerHTML = data.message;
        //alert(data.message); ///or what ever u want
      } else {
        $incoming = data.companies;
        var print ="<table class=\"table table-striped\"><tbody>";
        // document.getElementById('output').innerHTML = data.companies.Fullname;
        //behold ur databasecon: boi???
        for(var i=0;i<$incoming.length;i++){
          print+= "<tr><td><div class=\"row\"><div class=\"col-md-8\"><div class=\"col-lg-12 col-md-12 col-xs-12\" style=\"padding:0\"><h5 class=\"media-heading\">";
          print+=$incoming[i].raison+"<small> @"+$incoming[i].creation_date+"</small></h5></div>";
          print+="<small class=\"text-muted\">[ <i class=\"fa fa-user\"></i> Nom du Représentant : ] "+$incoming[i].representative_name +"</small><br>";
          print+="<small class=\"text-muted\"> [ <i class=\"fa fa-asterisk\"></i> N° Contribuable #: ] "+$incoming[i].tax_number +"</small>";
          print+="<small class=\"text-muted\">[ <i class=\"fa fa-map-marker\"></i> Localisation: ] "+$incoming[i].location +"</small>";
          print+="<small class=\"text-muted\"><i></i> [ B.P: ] "+$incoming[i].bp +"</small><br>";
          print+="<small class=\"text-muted\">[ <i class=\"fa fa-phone-square\"></i> TEL: ] "+$incoming[i].tel +"</small>";
          print+="<small class=\"text-muted\">[ <i class=\"fa fa-envelope\"></i> E-mail: ] "+$incoming[i].email +"</small>";
          print+="</div><div class=\"col-md-4\">";
          print+="<a id="+ $incoming[i].id + " onclick=\"popSingleMap(this.id)\"><button class=\"btn btn-primary btn-sm\" value=\"right\" type=\"button\" >";
          print+="<i class=\"glyphicon glyphicon-map-marker\"></i> mapview";
          print+="</button></a>";
          print+=" <button class=\"btn btn-default btn-sm\" value=\"right\" type=\"button\" id=\""+ $incoming[i].id+"\" onclick=\"UpdateCompany(this.id)\">";
          print+="<i class=\"fa fa-fw fa-cog\"></i> update";
          print+="</button>";
          print+=" <a id=\""+ $incoming[i].id +"\" onclick=\"deleteCompany(this.id)\"><button class=\"btn btn-danger btn-sm\" value=\"right\" type=\"button\">";
          print+="<i class=\"glyphicon glyphicon-trash\"></i> delete";
          print+="</button></a>";
          print+="</div></div></tr>";
        }
        print+="</tbody></table>";
        document.getElementById('output').innerHTML = print;
        document.getElementById('searchresult').innerHTML = "Search results for: "+ datatoggle;
      }
    }
  });

}
/*-----------------------------------
    VISITORS COMPANY SEARCH HERE
----------------------------------*/

function visitorsCompanySearchBox(){
  var companysearch = document.getElementById("searchbox");
  var datatoggle = companysearch.value;
  var data = {searchItem: companysearch.value};

    if(datatoggle.length < 1){
      $( "#visitors-output" ).addClass( "hidden" );
      $( "#visitors-tablemain" ).removeClass( "hidden" );
      $("#visitors-searchresult").addClass("hidden");
    }else{
      $( "#visitors-output" ).removeClass( "hidden" );
      $( "#visitors-tablemain" ).addClass( "hidden" );
      $("#visitors-searchresult").removeClass("hidden");
    }

  $.ajax({
    type        : 'post',
    data        : data,
    dataType    : 'json',
    url         : '/chamberedecommerce.com/searchCompanies',
    success     : function(data){

      if(!data.status){
        document.getElementById('visitors-searchresult').innerHTML = "<strong>Search results for: </strong>"+ datatoggle;
        document.getElementById('visitors-output').innerHTML = data.message;
      } else {
        $incoming = data.companies;
        var print ="<table class=\"table table-striped\"><tbody>";
        for(var i=0;i<$incoming.length;i++){
          print+= "<tr><td><div class=\"row\"><div class=\"col-md-9\"><div class=\"col-lg-12 col-md-12 col-xs-12\" style=\"padding:0\"><h5 class=\"media-heading\">";
          print+="<i class=\"fa fa-tag\"></i> "+$incoming[i].raison+"<small class=\"text-muted\"> @"+$incoming[i].creation_date+"</small></h5></div>";
          print+="<small class=\"text-muted\">[ <i class=\"fa fa-user\"></i> Nom du Représentant : ] "+$incoming[i].representative_name +"<small class=\"text-muted\"> [ <i class=\"fa fa-asterisk\"></i> N° Contribuable #: ] " + $incoming[i].tax_number +"</small><br>";
          print+="<small class=\"text-muted\">[ <i class=\"fa fa-map-marker\"></i> Localisation: ] "+$incoming[i].location +"</small>";
          print+="<small class=\"text-muted\"> [ B.P: ] "+$incoming[i].bp +"</small><br>";
          print+="<small class=\"text-muted\">[ <i class=\"fa fa-phone-square\"></i> TEL: ] "+$incoming[i].tel +"</small>";
          print+="<small class=\"text-muted\">[ <i class=\"fa fa-envelope\"></i> E-mail: ] "+$incoming[i].email +"</small>";
          print+="</div><div class=\"col-md-3\">";
          print+="<a id=\""+ $incoming[i].id +"\" class=\"float-right\" onclick=\"popSingleMap(this.id)\"><button class=\"btn btn-success btn-sm\"  type=\"button\">";
          print+="<i class=\"fa fa-map\"></i>  mapview";
          print+="</button></a>";
          print+="</div></div></tr>";
        }
        print+="</tbody></table>";
        document.getElementById('visitors-output').innerHTML = print;
        document.getElementById('visitors-searchresult').innerHTML = "<strong>Search results for:</strong> "+ datatoggle;
      }
    }
  });


}

/*-----------------------------------
            SETTINGS RESET USERNAME
----------------------------------*/

function UpdateUsername() {
  var usernameParse = document.getElementById("oldusername");
  var cur_usernameParse = document.getElementById("newusername");
  var userid = document.getElementById('userid').innerHTML;

  var username = usernameParse.value;
  var cur_username = cur_usernameParse.value;

  var parseData = {userid:userid,username: usernameParse.value,currentUsername:cur_usernameParse.value};

  var error = "";
  var illegalChars = /\W/; // allow letters, numbers, and underscores
  if(username.length<1 || cur_username.length < 1){
    document.getElementById("usernameErr").innerHTML = 'fields should not be left blank';
    document.getElementById("passwordErr").innerHTML = " ";
    document.getElementById("passwordSuccess").innerHTML = " ";
  }
  else if(username.length<5 || cur_username.length < 5){
    document.getElementById("usernameErr").innerHTML = 'please username should be atleast 5 charaters';
    document.getElementById("passwordErr").innerHTML = " ";
    document.getElementById("passwordSuccess").innerHTML = " ";
  }
  else if (illegalChars.test(username) || illegalChars.test(cur_username)) {
    document.getElementById("usernameErr").innerHTML = "username can only contain \'0-9\',\'_\',\'a-zA-Z\'";
    document.getElementById("passwordErr").innerHTML = " ";
    document.getElementById("passwordSuccess").innerHTML = " ";
  }else{
    //after username validation paarse data to database
    $.ajax({
      type        : 'post',
      data        : parseData,
      dataType    : 'json',
      url         : '/chamberedecommerce.com/staffroom/settings',
      success     : function(incoming){
        console.log(incoming);
        if(incoming == 'Username updated successfully'){
          document.getElementById("usernameSuccess").innerHTML = incoming;
          document.getElementById("usernameErr").innerHTML = " ";
        }else{
          document.getElementById("usernameErr").innerHTML = incoming;
        }
      }
    });
  }
}
/*-----------------------------------
            SETTINGS RESET PASSWORD
----------------------------------*/
function UpdateUserPassword() {
  var currentpwrd = document.getElementById("currentpwrd");
  var newpwrd = document.getElementById("newpwrd");
  var re_pwrd = document.getElementById("re_pwrd");
  var userid = document.getElementById('userid').innerHTML;

  var currentpwrdParse = currentpwrd.value;
  var newpwrdParse = newpwrd.value;
  var re_pwrdParse = re_pwrd.value;
  var parsewordData = {userid:userid, currentpwrdParse:currentpwrdParse, newpwrdParse: newpwrdParse};

  // var parseData = {userid:userid,username: usernameParse.value,currentUsername:cur_usernameParse.value};

  if(currentpwrdParse.length<1 || newpwrdParse.length < 1 || re_pwrdParse.length < 1){
    document.getElementById("passwordErr").innerHTML = 'fields should not be left blank';
    document.getElementById("usernameSuccess").innerHTML = " ";
    document.getElementById("usernameErr").innerHTML = " ";
  }
  else if(currentpwrdParse.length<8 || newpwrdParse.length < 8 || re_pwrdParse.length < 8){
    document.getElementById("passwordErr").innerHTML = 'please password should be atleast 8 charaters';
    document.getElementById("usernameSuccess").innerHTML = " ";
    document.getElementById("usernameErr").innerHTML = " ";
  }
  else if(newpwrdParse != re_pwrdParse){
    document.getElementById("passwordErr").innerHTML = 'passwords do not match';
    document.getElementById("usernameSuccess").innerHTML = " ";
    document.getElementById("usernameErr").innerHTML = " ";
  }
  else{
    //after password sanitization paarse data to database
    $.ajax({
      type        : 'post',
      data        : parsewordData,
      dataType    : 'json',
      url         : '/chamberedecommerce.com/staffroom/settings/pwrd',
      success     : function(incoming){  console.log(incoming);
        if(incoming == 'password updated successfully'){
          document.getElementById("passwordSuccess").innerHTML = incoming;
          document.getElementById("passwordErr").innerHTML = " ";
        }else{
          document.getElementById("passwordErr").innerHTML = incoming;
        }

      }
    });
  }
}
companySearch();
updateUsername();
UpdateUserPassword();
userVerificarionModal();
visitorsCompanySearchBox();
