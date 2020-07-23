async function getData() {
    const response = await fetch('/api'); // Default method is GET
    const data = await response.json();
    
    for(item of data) { 
        const root = document.createElement("p");
        const location = document.createElement("div") 
        const image = document.createElement("img");

        const time = new Date(item.timestamp);


        location.textContent = `lat : ${item.lat} , long : ${item.long}, Time : ${time}`;
        
        image.src = item.image64;
        image.alt = "screenshot"

        root.append(location, image);
        
        document.body.append(root);


    }

}

getData();