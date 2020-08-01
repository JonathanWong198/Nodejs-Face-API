async function getData() {
    const response = await fetch('/api'); // Default method is GET
    const data = await response.json();


    for(var i = data.length-1; i >= 0; i--) { 

        const item = data[i];

        const root = document.createElement("p");
        const location = document.createElement("div") ;
        const image = document.createElement("img");


        const time = new Date(parseInt(item.timestamp,10));
   

        location.textContent = `lat : ${item.st_y} , long : ${item.st_x}, Time : ${time}`;
    

        image.src = item.image64;
        image.alt = "screenshot";

        root.append(location, image);
        
        document.body.append(root);


    }

}

getData();