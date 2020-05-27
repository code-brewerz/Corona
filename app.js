const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var options = {
  method: 'GET',
  url: 'https://corona-virus-world-and-india-data.p.rapidapi.com/api_india',
  headers: {
    'x-rapidapi-host': 'corona-virus-world-and-india-data.p.rapidapi.com',
    'x-rapidapi-key': '7849253710mshd34743c161153d7p13cd49jsn4d42be27104d'
  }
};

var listCountry = [];
var listState = [];
var listDistrict = [];

app.get("/",function (req,res) {
  request(options,function (error,response,body) {

      res.render("home",{DataOfCountry:listCountry,DataOfState:listState,DataOfDistrict:listDistrict});
  });

});

app.post("/",function (req,res) {

  request(options, function (error, response, body) {
  	var data = JSON.parse(body);
    var state = req.body.state;
    var districts = req.body.district;

    listCountry.push(data.total_values.lastupdatedtime);
    listCountry.push(data.total_values.confirmed);
    listCountry.push(data.total_values.active);
    listCountry.push(data.total_values.deaths);
    listCountry.push(data.total_values.recovered);

    listState.push(state);
    listState.push(data.state_wise[state].confirmed);
    listState.push(data.state_wise[state].active);
    listState.push(data.state_wise[state].deaths);
    listState.push(data.state_wise[state].recovered);

    listDistrict.push(districts);
    listDistrict.push(data.state_wise[state].district[districts].confirmed);
    listDistrict.push(data.state_wise[state].district[districts].active);
    listDistrict.push(data.state_wise[state].district[districts].deceased);
    listDistrict.push(data.state_wise[state].district[districts].recovered);

    res.redirect("/");

    setTimeout(function () {
      listCountry.splice(0,listCountry.length);
      listState.splice(0,listState.length);
      listDistrict.splice(0,listDistrict.length);
    }, 5000);
  });

});

app.listen(process.env.PORT || 8000,function () {
  console.log("Server initiated at 8000");
});
