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

app.get('/api/exploredata', (request, response) => {
    database.collection("Explore").find({}).toArray((error, result) => {
        response.send(result);
    });
})

const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb package

app.get('/api/data/:id', (request, response) => {
    const destinationId = request.params.id;
    database.collection("Destinations").findOne({ _id: ObjectId(destinationId) }, (error, result) => {
        if (error) {
            console.error('Error fetching destination by ID:', error);
            response.status(500).json({ message: 'Internal server error' });
        } else {
            response.json(result);
        }
    });
});



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
            const responseData = JSON.stringify({ userId: user._id });
            
            response.send(responseData);
            // response.status(200).send('User authenticated successfully');
        } else {
            // User not found, send failure response
            response.status(401).send('User not found or incorrect credentials');
        }
    });
});

app.post('/api/favorites', async (request, response) => {

    const { userId, destinationId } = request.body;
    try {
      const favoritesCollection = database.collection('favorites');
      const result = await favoritesCollection.insertOne({ userId, destinationId });
      response.status(201).json(result.ops && result.ops.length > 0 ? result.ops[0] : {});
    } catch (err) {
      console.error('Error adding favorite:', err);
      response.status(500).json({ error: 'Internal server error' });
    }
  });
  app.get('/api/favorites/:userId', async (request, response) => {
    
    const userId = request.params.userId;
    try {
      const favoritesCollection = database.collection('favorites');
      const favorites = await favoritesCollection.find({ userId: userId }).toArray();
      response.json(favorites);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      response.status(500).json({ error: 'Internal server error' });
    }
  });





  app.get('/api/favorite_destinations/:userId', async (request, response) => {
    
    const userId = request.params.userId;
    try {
      const favoritesCollection = database.collection('favorites');
      const favoritesWithDestinations = await favoritesCollection.aggregate([
        {
          $match: { userId: userId } // Filter favorites by userId
        },
        {
          $lookup: {
            from: 'destinations', // Name of the destinations collection
            localField: 'destinationId', // Field in the favorites collection
            foreignField: '_id', // Field in the destinations collection
            as: 'destination' // Alias for the joined data
          }
        },
        {
          $unwind: '$destination' // Convert destination array to object
        },
        {
          $project: {
            _id: 0, // Exclude _id field from favorites
            userId: 0 // Exclude userId field from favorites
          }
        }
      ]).toArray();
    // const favorites = await favoritesCollection.find({ userId: userId }).toArray();
    //   response.json(favorites);
      
      response.json(favoritesWithDestinations);
      
    } catch (err) {
      console.error('Error fetching favorites:', err);
      response.status(500).json({ error: 'Internal server error' });
    }
  });
// app.post('/api/saved', async (req, res) => {
//     const { userId, destinationId } = req.body;
//     const savedCollection = database.collection('saved');
//     try {
//       const result = await savedCollection.insertOne({ userId, destinationId });
//       res.status(201).json(result.ops[0]);
//     } catch (err) {
//       console.error('Error adding favorite:', err);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });


