/**
 * New node file
 */

//Import dependencies


const passport = require('passport');
const express = require('express');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
var fs = require('fs');
var mongoose = require('mongoose');
var multer  = require('multer');
var mongo = require('mongodb');

//Set up middleware
const requireAuth = passport.authenticate('jwt', { session: false });

//Load models
const User = require('../models/user');
const Chat = require('../models/chat');

//Export the routes for our app to use
module.exports = function(app) {
	// API Route Section

	// Initialize passport for use
	app.use(passport.initialize());

	// Bring in defined Passport Strategy
	require('../config/passport')(passport);

	// Create API group routes
	const router = express.Router();

	var storage =   multer.diskStorage({
		destination: function (req, file, callback) {
			callback(null, './uploads');
		},
		filename: function (req, file, callback) {
			callback(null, file.fieldname + '-' + Date.now());
		}
	});
	var upload = multer({ storage : storage }).array('userPhoto',2);


	app.post('/api/photo',function(req,res){
		upload(req,res,function(err) {

			console.log(" body data",req.body);
			console.log("number of files",req.files);
			var stringify = JSON.stringify(req.files)
			var filesObject = JSON.parse(stringify);

			console.log("file objects",filesObject);

			var dirname = require('path').dirname(__dirname);
			console.log(" dirname === "+dirname);

			for (var i = 0;i<filesObject.length;i++) 
			{
				var fileString = JSON.stringify(filesObject[i]);
				var fileObject = JSON.parse(fileString);
					console.log(" orignal file == "+fileObject + " data =="+fileObject.originalname);

					var filename = fileObject.originalname;
					console.log(" filename == "+filename);
					var path = fileObject.path;
					var type = fileObject.mimetype;

					var read_stream =  fs.createReadStream(dirname + '/' + path);
					//var mongoclient = new mongo.Db('test', new mongo.Server("127.0.0.1", 27017));
					var MongoClient=require('mongodb').MongoClient,

					server=require('mongodb').Server;

					var mongoclient=new MongoClient(new server('localhost',27017));
					mongoclient.connect('mongodb://localhost:27017/test',function(err,db)
							{
							    if(err) throw err;
							    var query={'grade':100};

							    console.log(" db connected === ");
						
					
					var Grid = require('gridfs-stream');
					Grid.mongo = mongoose.mongo;

					var gfs = Grid(db);

					var writestream = gfs.createWriteStream({
						filename: filename
					});
					read_stream.pipe(writestream);
					 writestream.on('close', function (file) {
					        // do something with `file`
					        console.log('Written To DB %j',file);
					    });
					console.log("done data writing %j",req.body);
							});
				
			}

			if(err) {
				return res.end("Error uploading file."+err);
			}
			res.end("File is uploaded");
		});
	});


	

	router.get('/file/:id',function(req,res){
		var pic_id = req.param('id');
		var gfs = req.gfs;

		gfs.files.find({filename: pic_id}).toArray(function (err, files) {

			if (err) {
				res.json(err);
			}
			if (files.length > 0) {
				var mime = 'image/jpeg';
				res.set('Content-Type', mime);
				var read_stream = gfs.createReadStream({filename: pic_id});
				read_stream.pipe(res);
			} else {
				res.json('File Not Found');
			}
		});
	});


	// Set url for API group routes
	app.use('/product', router);
};





