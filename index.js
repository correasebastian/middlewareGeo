// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8100;


// routes will go here

// routes will go here
app.get('/api/near', function(req, res) {
	console.log(req.params)
    var user_id = req.param('id');
    var radio = req.param('radio') || 5 //radio en kilometros
    var lat = req.param('lat');
    var lng = req.param('lng');
    var tacos = req.param('tacos');
    var tacosArray = tacos.split(",");


    // res.send(user_id + ' ' + tacosArray + ' ' + radio);
    res.json(tacosArray)
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
