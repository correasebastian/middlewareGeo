// grab the packages we need
var express = require('express');
var GeoFire = require('GeoFire');
var Firebase = require('Firebase');
var _ = require('lodash')
var app = express();
var port = process.env.PORT || 8100;


var fg = new Firebase('https://scm-geofire.firebaseio.com/testGeo/')
var fl = new Firebase('https://scm-geofire.firebaseio.com/lugares/')
var fg2 = new Firebase('https://scm-geofire.firebaseio.com/testGeo2/')
var geoFire = new GeoFire(fg);
var geoFire2 = new GeoFire(fg2);

// routes will go here

// routes will go here
app.get('/api/near', function(req, res) {
    console.log(req.params)
    var user_id = req.param('id');
    var radio = (req.param('radio')) ? parseInt(req.param('radio')) : 15; //radio en kilometros
    var lat = req.param('lat');
    var lng = req.param('lng');
    var tacos = req.param('tacos');
    var tacosArray = tacos.split(",");
    var arrayPlaces = []
    var completeArrayP = [];

    function onSnap(snap) {
        console.log(snap);
        console.log(snap.val());
        var obj = snap.val();
        if (obj) {
            obj.key = snap.key();
            completeArray.push(obj)
        }
    }

    var latLng = [lat, lng]


    var geoQuery = geoFire.query({

        center: [40.74664, -73.87324],
        radius: radio
    });

    var geoQuery2 = geoFire2.query({
        center: [40.74664, -73.87324],
        radius: radio
    });

    var onReadyRegistration = geoQuery.on("ready", function(r) {
        console.log("GeoQuery has loaded and fired all other events for initial data", r);
    });

    var onReadyRegistration2 = geoQuery2.on("ready", function(r) {
        console.log("GeoQuery2 has loaded and fired all other events for initial data", r);
    });

    var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {

        arrayPlaces.push(key);
        // fl.child(key).once('value', onSnap)
        console.log(key + " entered query at " + location + " (" + distance + " km from center)");
    });

    var onKeyEnteredRegistration2 = geoQuery2.on("key_entered", function(key, location, distance) {

        arrayPlaces.push(key);
        // fl.child(key).once('value', onSnap)
        console.log(key + " entered query at " + location + " (" + distance + " km from center)");
    });

    function backArray() {
        var uA = _.uniq(arrayPlaces);
        getCompleteInfo(uA)
            .then(function() {
                res.json(completeArrayP)
            })

    }

    function getCompleteInfo(array) {
        var qArray = []
        array.forEach(evalObj)

        function evalObj(key, i, sameArray) {
            console.log(key, i);
            qArray.push(scmP(key))
        }

        return Promise.all(qArray)
            .then(function(values) {
                console.log('finish', values); // [3, 1337, "foo"] 
                return values;
            }).catch(function(error) {
                console.log('error api')
            })
    }

    function scmP(key) {
        return new Promise(function(resolve, reject) {
            fl.child(key).once('value', function(snap) {
                var obj = snap.val();
                if (obj) {
                    obj.key = snap.key();
                    completeArrayP.push(obj)
                }
                resolve();

            }, function(error) {
                reject(error)
            })

        })

    }


    var timeoutID = setTimeout(backArray, 300);


});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
