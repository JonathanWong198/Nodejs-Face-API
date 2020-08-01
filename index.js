// Command to run this nodejs server file : nodemon index.js
// Connect to this server through browser : localhost:3000 


// Creating webserver
const express = require("express");
const Datastore = require('nedb');
const fs = require('fs');
const fetch = require('node-fetch');
const pool = require("./database");



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


function convertBase64toImage(dataString) {

    var image = dataString;

    var data = image.replace(/^data:image\/\w+;base64,/, '');

    fs.writeFileSync("out.png", data, {encoding: 'base64'}, (err)=>{})

}

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

// Routes to Database

// setting up the GET endpoint for /api 
app.get("/api", async (request, response) => {

        try {

            const data = await pool.query("SELECT id, ST_X(ST_AsText(coordinates)), ST_Y(ST_AsText(coordinates)) , image64, timestamp FROM selfieinfo");
            response.json(data.rows);
        } 

        catch(err) {
            console.log(err);

        }


        

    // });

});


// Entering selfie information 
app.post("/api", async (request, response) => {

    try {
        const latitude = request.body.lat;
        const longitude = request.body.long;
        const coordinates = `POINT(${longitude} ${latitude})`;

        const timestamp = Date.now();
        const image64 = request.body.image64;

        const newData = await pool.query(   
            "INSERT INTO selfieinfo(coordinates, image64, timestamp) VALUES($1,$2,$3) RETURNING id, ST_AsText(coordinates), image64, timestamp", 
            [coordinates, image64, timestamp]
        );


        await convertBase64toImage(request.body.image64);

        const imageBuffer = fs.readFileSync('out.png');

        const facialData = await getFaceData(imageBuffer);

        newData.rows[0].facialData = facialData;
        
        response.json(newData.rows[0]);
    }

    catch(err) {
        console.error(err);

    }

     
});

