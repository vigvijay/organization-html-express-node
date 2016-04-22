 var http = require("http");
 var express = require("express");
 var app = express();
 var path = require('path');
 var formidable = require("formidable");
 var util = require('util');
 var fs   = require('fs-extra');

/* var bodyParser = require('body-parser');


 app.use(bodyParser.urlencoded({ // Tell express to use bodyParser
 	extended: true
 }));
*/

 app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/careers', function(req, res) {
  res.sendFile(path.join(__dirname + '/careers.html'));
});
app.post('/uploadprocess', function(req, res){
  var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
		{
		res.sendFile(path.join(__dirname + '/careers_success.html'));
		}
      //res.writeHead(200, {'content-type': 'text/plain'});
      //res.write('received upload:\n\n');
      //res.end(util.inspect({fields: fields, files: files}));
    });
    //console.log(req.body['firstName']);
    var fieldsArray = [];
    var fieldDetails = "";
    form.on('field', function (field, value) {

        fieldsArray[field] = value;
        fieldDetails += field + " : " + value + "\n";
    });

    form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        console.log(temp_path + " " + file_name);
        var new_location = './uploads/';

        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!");
            }
        });
        var nodemailer = require('nodemailer');
       var transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
           user: 'zeenspierweb@gmail.com',
           pass: 'Zeenspier1234'
         }
       }, {
         // default values for sendMail method
         from: 'sender@address',
         headers: {
           'My-Awesome-Header': '123'
         }
       });

       var mailOptions = {
         to: 'zeenspierweb@gmail.com',
         subject: fieldsArray['Subject'] + " : " + fieldsArray['First Name'],
         text: fieldDetails,
         attachments: [{path: new_location + file_name}]
       };

       transporter.sendMail(mailOptions, function(error, info){
          if(error){
              return console.log(error);
          }
		  try{
			  fs.unlinkSync(new_location + file_name);
		  }
		  catch(exception){
			  console.log(file_name + " was not found");
		  }
          
    });
});
});

app.post('/contact', function(req, res){
  var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
		{
		res.sendFile(path.join(__dirname + '/contact_success.html'));
		}
      
    });
    //console.log(req.body['firstName']);
    var fieldsArray = [];
    var fieldDetails = "";
    form.on('field', function (field, value) {

        fieldsArray[field] = value;
        fieldDetails += field + " : " + value + "\n";
    });

    form.on('end', function(fields, files) {
        
        var new_location = './uploads/';

        
        var nodemailer = require('nodemailer');
       var transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
           user: 'zeenspierweb@gmail.com',
           pass: 'Zeenspier1234'
         }
       }, {
         // default values for sendMail method
         from: 'sender@address',
         headers: {
           'My-Awesome-Header': '123'
         }
       });

       var mailOptions = {
         to: 'zeenspierweb@gmail.com',
         subject: fieldsArray['Subject'] + " : " + fieldsArray['organization'],
         text: fieldDetails
       };

       transporter.sendMail(mailOptions, function(error, info){
          if(error){
              return console.log(error);
          }
		            
    });
});
});
      


var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});

 app.use(express.static(__dirname + '/'));
// http.createServer(app).listen(3000);
 //app.listen(8080);
