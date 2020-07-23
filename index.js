// Command to run this nodejs server file : nodemon index.js
// Connect to this server through browser : localhost:3000 


// Creating webserver
const express = require("express");
const Datastore = require('nedb');
const atob = require("atob");
const fs = require('fs');
const fetch = require('node-fetch');
const url = require('url'); 

//Setting up enviornment variables 
require('dotenv').config()


const subscriptionKey = process.env.API_KEY;
const endpoint = 'https://eastus.api.cognitive.microsoft.com/' + '/face/v1.0/detect?' + 'returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise';


const app = express();

// Server is listening
const port = process.env.PORT
app.listen(port, () => console.log("Starting sever at " + port));

// Serve webpages from the public folder to those trying to access
app.use(express.static('public'));

// Parse Json data
app.use(express.json({limit: '50mb'}));

const database = new Datastore("database.db");
database.loadDatabase();


async function getFaceData(image) {

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/octet-stream', 
            'Ocp-Apim-Subscription-Key': subscriptionKey 
        },

        body: image

    };

        const response = await fetch(endpoint, options);
      
        const responseData = await response.json()
        // console.log(responseData); 
        if("error" in responseData) {
            console.log(responseData);
        } else {
        responseData.forEach((face) => {
            console.log('Face ID: ' + face.faceId)
            console.log('Face rectangle: ' + face.faceRectangle.top + ', ' + face.faceRectangle.left + ', ' + face.faceRectangle.width + ', ' + face.faceRectangle.height);
            console.log('Smile: ' + face.faceAttributes.smile);
            console.log('Head pose: ' + JSON.stringify(face.faceAttributes.headPose));
            console.log('Gender: ' + face.faceAttributes.gender);
            console.log('Age: ' + face.faceAttributes.age);
            console.log('Facial hair: ' + JSON.stringify(face.faceAttributes.facialHair));
            console.log('Glasses: ' + face.faceAttributes.glasses);
            console.log('Smile: ' + face.faceAttributes.smile);
            console.log('Emotion: ' + JSON.stringify(face.faceAttributes.emotion));
            console.log('Blur: ' + JSON.stringify(face.faceAttributes.blur));
            console.log('Exposure: ' + JSON.stringify(face.faceAttributes.exposure));
            console.log('Noise: ' + JSON.stringify(face.faceAttributes.noise));
            console.log('Makeup: ' + JSON.stringify(face.faceAttributes.makeup));
            console.log('Accessories: ' + JSON.stringify(face.faceAttributes.accessories));
            console.log('Hair: ' + JSON.stringify(face.faceAttributes.hair));
            console.log();
        })

        return responseData;
    }

}

// Recieve information from the user by setting up an endpoint
// setting up /api an an endpoint to recieve post requests
app.post("/api", async (request, response) => {
    
    console.log("Request recieved")
 
    // console.log(request.body);

    const data = request.body; 

    //adding timestamp to the json request 
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);


    const imageBuffer = fs.readFileSync('out.jpg');

    const facialData = await getFaceData(imageBuffer);

    // Sending back a response
    response.json({
        status : "Success",
        latitude : data.lat,
        longitude : data.long,
        timestamp : data.timestamp,
        image64: data.image64,
        facialData : facialData



    });

});

// setting up the GET endpoint for /api 
app.get("/api", (request, response) => {

    database.find({}).sort({timestamp : -1}).exec((err, data) => {
        if (err) {
            response.end();
            return
        }
        response.json(data);

    });

});

