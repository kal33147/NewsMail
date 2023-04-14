const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
     res.sendFile(__dirname +"/signup.html");
});

app.post("/", function(req, res){

     const nombre = req.body.nombre;
     const apellido = req.body.apellido;
     const correo = req.body.correo;

     console.log(nombre, apellido, correo);

     const data = {
          members: [
               {
                    email_address: correo,
                    status: "subscribed",
                    merge_fields:{
                         FNAME: nombre,
                         LNAME: apellido
                    }
               }
          ]
     };
     const jsonData = JSON.stringify(data);
     
     const url = "https://us21.api.mailchimp.com/3.0/lists/66e8ccbd4b";

     const options = {
          method: "POST",
          auth: "kal1:3cad2b3116a3b12b4656751b4189f57d-us21"
     }

     const request = https.request(url, options, function(response){

          if(response.statusCode ===200){
               res.sendFile(__dirname +"/success.html");
          }else{
               res.sendFile(__dirname +"/failure.html");
          }

          response.on("data", function(data){
               console.log(JSON.parse(data));
          });
     });
     request.write(jsonData);
     request.end();
})

// 3cad2b3116a3b12b4656751b4189f57d-us21
// 66e8ccbd4b

app.post("/failure", function(req, res){
     res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
     console.log("Server running...");
});




