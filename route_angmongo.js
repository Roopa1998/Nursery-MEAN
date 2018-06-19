var express = require('express');  
var bodyParser = require('body-parser'); 
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var app = express();  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// Connect to the db

MongoClient.connect("mongodb://127.0.0.1/mydb", function(err, db) {

 if(!err) {
    console.log("We are connected");

app.use(express.static('public')); //making public directory as static directory  
app.use(bodyParser.json());
app.get('/', function (req, res) {  
   console.log("Got a GET request for the homepage");  
   res.send('<h1>Welcome to MSRIT</h1>');  
})
/*JS client side files has to be placed under a folder by name 'public' */

app.get('/index.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );    
})  

app.get('/insert.html', function (req, res) {
    res.sendFile( __dirname + "/" + "insert.html" );
})
/* to access the posted data from client using request body (POST) or request params(GET) */
//-----------------------POST METHOD-------------------------------------------------
app.post('/process_post', function (req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
	res.setHeader('Content-Type', 'text/html');
    /*response has to be in the form of a JSON*/
    req.body.serverMessage = "NodeJS replying to angular"
        /*adding a new field to send it to the angular Client */
		console.log("Sent data are (POST): Plant ID :"+req.body.plantid+" Plant Name="+req.body.plantname);
		// Submit to the DB
  	var plantid = req.body.plantid;
    var plantname = req.body.plantname;
var type=req.body.type;
var qty=req.body.qty;
var cost=req.body.cost;
	db.collection('plant').insert({plantid:plantid,plantname:plantname,type:type,qty:qty,cost:cost});
    res.send("plant Inserted");
    /*Sending the respone back to the angular Client */
});

//--------------------------GET METHOD-------------------------------
app.get('/process_get', function (req, res) { 
// Submit to the DB
  var newPlant = req.query;
	var plantid = req.query['plantid'];
    var plantname = req.query['plantname'];
var type=req.query['type'];
var qty=req.query['qty'];
var cost=req.query['cost'];
	db.collection('plant').insert({plantid:plantid,plantname:plantname,type:type,qty:qty,cost:cost});	
    console.log("Sent data are (GET): PlantID :"+plantid+" and Plant name :"+plantname);
  	res.send("Plant Inserted-->"+JSON.stringify(newPlant));
}) 

//--------------UPDATE------------------------------------------
app.get('/update.html', function (req, res) {
    res.sendFile( __dirname + "/" + "update.html" );
})

app.get("/update", function(req, res) {
	var plantname1=req.query.plantname;
	var qty1=req.query.qty;
    //db.collection('plant').update({"plantname":plantname1},{$set:{"plantname":"newplant"}}); 
	//-----------------------------------------
    var collectionName = 'plant'; // or whatever the name of your collection name , its similar like your table name in SQL
    var collection = db.collection(collectionName);
    if(!collection){
        errCallback('Collection is not defined in database')
    }
    collection.update({plantname:plantname1},{$set:{qty:qty1}},{multi:true}, function(err, result) {
				if (err) {
					console.log("Failed to update data.");
			} else {
                    res.send("Plant Updated");
				console.log("Plant Updated")
			}
        });
    });

//--------------SEARCH------------------------------------------
app.get('/search.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "search.html" );    
})

app.get("/search", function(req, res) {
	//var plantidnum=parseInt(req.query.plantid)  // if plantid is an integer
	var plantidnum=req.query.plantid;
    db.collection('plant').find({plantid: plantidnum}).toArray(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data.");
    } else {

      //res.status(200).json(docs);
res.render('disp.ejs',{plant: docs})  
    }
  });
  });
  // --------------To find "Single Document"-------------------
	/*var plantidnum=parseInt(req.query.plantid)
    db.collection('plant').find({'plantid':plantidnum}).nextObject(function(err, doc) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    } else {
      res.status(200).json(doc);
    }
  })
}); */

//--------------DELETE------------------------------------------
app.get('/delete.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "delete.html" );    
})

app.get("/delete", function(req, res) {
	//var plantidnum=parseInt(req.query.plantid)  // if plantid is an integer
	var plantidnum=req.query.plantid;
	db.collection('plant', function (err, data) {
        data.remove({"plantid":plantidnum}, function(err, result){
				if (err) {
					console.log("Failed to remove data.");
			} else {
                    db.collection('plant').find().sort({plantid:1}).toArray(
                        function(err , i){
                            if (err) return console.log(err)
                            res.render('disp.ejs',{plant: i})
                        })
				console.log("Plant Deleted")
			}
        });
    });
    
  });
app.get('/display', function (req, res) { 
//-----DISPLAY IN JSON FORMAT  -------------------------
/*db.collection('plant').find({}).toArray(function(err, docs) {
    if (err) {
      console.log("Failed to get data.");
    } else 
	{
		res.status(200).json(docs);
    }
  });*/
//-------------DISPLAY USING EMBEDDED JS -----------
 db.collection('plant').find().sort({plantid:1}).toArray(
 		function(err , i){
        if (err) return console.log(err)
        res.render('disp.ejs',{plant: i})  
     })
//---------------------// sort({plantid:-1}) for descending order -----------//
}) 
app.get('/about', function (req, res) {  
   console.log("Got a GET request for /about");  
   res.send('Plant Nursery');  
})  
 
var server = app.listen(3000, function () {
var host = server.address().address  
  var port = server.address().port  
console.log("Example app listening at http://%s:%s", host, port)  
})  
}
else
{   if(db)
    db.close();  }
  
});
