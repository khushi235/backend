var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const { error } = require("console");
const { request } = require("http");

var app = express();
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
var CONNECTION_STRING = "mongodb+srv://shuklakhushim2:Khushis_235@cluster0.tnbn4po.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var DATABASENAME = "Travelapp";
var database;

// app.get('/api/data', async (req, res) => {
//     try {
//       // Fetch data from MongoDB
//       const data = await Destinations.find(); // MyModel is your Mongoose model
//       res.json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   });
  
//   const PORT = process.env.PORT || 5500;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.listen(5500, () => {
    MongoClient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASENAME);
        console.log("Connected");
    })
})
app.get('/api/data', (request, response) => {
    database.collection("Destinations").find({}).toArray((error, result) => {
        response.send(result);
    });
})
app.get('/backend/travel/GetUser', (request, response) => {
    database.collection("User").find({}).toArray((error, result) => {
        response.send(result);
    });
})
app.post('/backend/travel/Register', (request, response) => {
    console.log('receiving data ...');
    console.log('body is ', request.body);
    // Insert form data into "User" collection
    database.collection("User").insertOne(request.body, (err, res) => {
        if (err) throw err;
        console.log("User data inserted");
        response.send("User data inserted successfully");
    });
});
app.post('/backend/travel/Login', (request, response) => {
    const { email, password } = request.body;

    // Query the database to find a user with the provided email and password
    database.collection("User").findOne({ email, password }, (error, user) => {
        if (error) {
            console.error('Error querying database:', error);
            response.status(500).send('Internal server error');
            return;
        }

        if (user) {
            // User found, send success response
            response.status(200).send('User authenticated successfully');
        } else {
            // User not found, send failure response
            response.status(401).send('User not found or incorrect credentials');
        }
    });
});





/*var express=require("express");
var MongoClient=require("mongodb").MongoClient;
var cors=require("cors");
const multer=require("multer");
const { error } = require("console");
const { request } = require("http");

var app=express();
app.use(cors());
var CONNECTION_STRING="mongodb+srv://shuklakhushim2:Khushis_235@cluster0.tnbn4po.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var DATABASENAME="Travelapp";
var database;
app.listen(5500,()=>{
    MongoClient.connect(CONNECTION_STRING,(error,client)=>{
        database=client.db(DATABASENAME);
        console.log("Connected");
    })
})
app.get('/backend/travel/GetUser',(request,response)=>{
    database.collection("User").find({}).toArray((error,result)=>{
        response.send(result);
    });
})
app.post('/backend/travel/Register',(request,response) =>{
    console.log('receiving data ...');
    console.log('body is ',request.body);
    response.send(request.body);
});*/