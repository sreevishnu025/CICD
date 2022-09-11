const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({exteended: true }));

app.get("/",function (req,res){
    res.send("<h1>Hello World 2</h1>");
});

app.listen(3000,function (){
    console.log("server is running in port 3000");
});