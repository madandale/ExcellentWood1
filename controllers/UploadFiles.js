/**
 * New node file
 */
const express = require('express');

var multer  = require('multer');
var upload = multer({ dest: 'products/'});
var fs = require('fs');
const appConstants = require('../config/appConstants');
var path = require('path');


module.exports = function(app) {
  // API Route Section


  // Create API group routes
  const router = express.Router();

  var appRootFolder = function(dir,level){
	    var arr = dir.split('\\');
	    arr.splice(arr.length - level,level);
	    var rootFolder = arr.join('\\');
	    return rootFolder;
	}
  /** Permissible loading a single file, 
      the value of the attribute "name" in the form of "recfile". **/
 
/*  app.post('/uploadFile', function(req, res){

	  // create an incoming form object
	/*  var form = new formidable.IncomingForm();

	  // specify that we want to allow the user to upload multiple files in a single request
	  form.multiples = true;

	  // store all uploads in the /uploads directory
	  form.uploadDir = path.join(__dirname, '/uploads');

	  // every time a file has been uploaded successfully,
	  // rename it to it's orignal name
	  form.on('file', function(field, file) {
	    fs.rename(file.path, path.join(form.uploadDir, file.name));
	  });

	  // log any errors that occur
	  form.on('error', function(err) {
	    console.log('An error has occured: \n' + err);
	  });

	  // once all the files have been uploaded, send a response to the client
	  form.on('end', function() {
	    res.end('success');
	  });  

	  // parse the incoming request containing the form data
	  form.parse(req);  
	  
	  

	});*/
  
  
  
  app.post('/uploadProduct', upload.single("file"), function (req, res) {
	  
	  fs.mkdir("/products", function(error) {
		    //When it fail in this way, do the custom steps
		    if (error && error.errno === 34) {
		      //Create all the parents recursively
		      fs.mkdirParent(path.dirname(dirPath), 0777, callback);
		      //And then the directory
		      fs.mkdirParent(dirPath, 0777, callback);
		    }
	  })
	  	//	path.join(__dirname, '/uploads');
	 // console.log("files root folder"+appRootFolder(__dirname,1));
	   var file = "products" + "/" + req.file.originalname;
	   fs.readFile( req.file.path, function (err, data) {
	        fs.writeFile(file, data, function (err) {
	         if( err ){
	              console.error( err );
	              response = {
	                   message: 'Sorry, file couldn\'t be uploaded.',
	                   filename: req.file.originalname
	              };
	         }else{
	               response = {
	                   message: 'File uploaded successfully',
	                   filename: req.file.originalname
	              };
	          }
	          res.end( JSON.stringify( response ) );
	       });
	   });
	})

  
  app.use('/file', router);	
};

