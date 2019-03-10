const request = require('request');

//Gebruik maken van de darksky api
const forecast = (longitude, latitude, callback) => {

    const url = "https://api.darksky.net/forecast/d7208144987fd04176175f1ddb1d18a3/"+ longitude +","+ latitude +"?units=si&lang=nl"
    
    request({url, json:true}, (error, {body}) => {
        if(error){
            callback("Unable to connect to weather service.", undefined);
        } else if ( body.error) {
            callback("Unable to find location. Please try another.");
        } else {
            callback(undefined, body.daily.data[0].summary + " It is currently " + body.currently.temperature +
                                " degrees out. There is a " + body.currently.precipProbability + "% chance of rain");
        }
    })
}

module.exports = forecast;