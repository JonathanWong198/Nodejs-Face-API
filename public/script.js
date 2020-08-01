function getKeyByValue(object, value) { 
    for (var prop in object) { 
        if (object.hasOwnProperty(prop)) { 
            if (object[prop] === value) 
            return prop; 
        } 
    } 
} 

function maxConfidenceEmotion(emotionList) {

    const highestEmotions = [];
    var current = 0;

    for(var entry in emotionList) {
        if(emotionList.hasOwnProperty(entry)) {
            var value = emotionList[entry];
            if(current < value) {
                current = value;
                highestEmotions.push(entry);
                console.log(current);
            }
        }

    }

    return highestEmotions[highestEmotions.length - 1];
}

// This function must be called setup because p5 is looking for a setup function
function setup() { 


    const data = {}


    if("geolocation" in navigator) {
        console.log("geolocation avaliable");

        navigator.geolocation.getCurrentPosition(position => {

            console.log(position.coords);

            const lat = position.coords.latitude;
            const long = position.coords.longitude;

            document.getElementById("latitude").textContent = lat;
            document.getElementById("longitude").textContent = long;
            
            data.lat = lat;
            data.long = long;


        });

    } else {
        console.log("geolocation unavaliable");
    }


    noCanvas(); //remove the default canvas that comes with p5
    const video = createCapture(VIDEO);
    video.size(320,240);
    video.center("horizontal");


    const submit = document.getElementById("submit");
    submit.addEventListener("click", async event => {

        // Captures image
        video.loadPixels();
        image64 = video.canvas.toDataURL();

        data.image64 = image64;

        const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        };

        
        const response = await fetch('/api', options);
        console.log("Successfully sent data");
        console.log("Recieved Response");
        const responseData = await response.json();
        console.log(responseData);

        // Parse the response data and present the data onto the HTML
        document.getElementById("age").textContent = responseData.facialData[0].faceAttributes.age;
        const emotions = responseData.facialData[0].faceAttributes.emotion;
        document.getElementById("mood").textContent = maxConfidenceEmotion(emotions);
    });
                
}
