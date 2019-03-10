// Basic web server
const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
// Om de applicatie te laten werken op HEROKU, moet de correcte port worden
// doorgegeven aan de app.listen methode. Deze is op de servers van heroku
// te vinden binnen het process.env object. Lokaal wordt 3000 genomen
const port = process.env.PORT || 3000
// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const views = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup hanlebars and views location
// Zal de engine toewijzen die express zal gebruiken.
// In dit geval hbs
app.set('view engine', 'hbs');
// Directory waar de views zich bevinden
app.set('views', views);
hbs.registerPartials(partialsPath);

// Setup static directorie
// Directory waar de resources zich bevinden => index.html bvb
app.use(express.static(publicDirectoryPath));

// Object wordt automatisch gestringified door express bij res.send

app.get('', (req, res) => {
    // render zal de ingestelde view engine gebruiken om de pagina 
    // te genereren
    res.render('index', {
        title: 'Weather App',
        name: "Kurt Van Hal"
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: "Kurt Van Hal"
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: "This is the help page!",
        title: 'Help',
        name: "Kurt Van Hal"
    });
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address"
        })
    }

    // Belangrijk! default waarde geven aan het object. Indien dit niet 
    // wordt gedaan zal js het doorgegeven object willen destructurenn, hetgeen
    // niet mogelijk is indien undefined.
    geocode(req.query.address, (error, {
        longitude,
        latitude,
        location
    } = {}) => {
        if (error) {
            return res.send({
                error: error
            })
        } else {
            forecast(latitude, longitude, (error, forecastdata) => {
                if (error) {
                    return res.send({
                        error: error
                    })
                } else {
                    res.send({
                        forecast: forecastdata,
                        location,
                        address: req.query.address
                    })
                }
            })
        }
    });

});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    res.send({
        products: []
    })
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        message: "Help article not found",
        title: '404',
        name: "Kurt Van Hal"
    });
})

// Alles dat niet matcht
app.get('*', (req, res) => {
    res.render('404', {
        message: "Page not found",
        title: '404',
        name: "Kurt Van Hal"
    })
});


//
app.listen(port, () => {
    console.log("Server is up on port " + port);
});