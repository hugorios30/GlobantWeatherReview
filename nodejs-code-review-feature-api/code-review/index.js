const express = require('express');
const app = express();
const Weather = require('./lib/service');
const { DEFAULT_UNIT } = require('./constants'); //require constant from file

let unit = DEFAULT_UNIT;


app.get('/weather/set-units/:unit', req => {
    unit = req.params.unit;
    res.status(200);
    res.send('OK!');
});

app.get('/weather/:city', (req, res, next) => {
    Weather.get(req.params.city, unit)
        .then(data => {
            res.status(200);
            res.send(data);
        }).catch(next)
});

app.get('/weather/forecast/:city', (req, res, next) => {
    Weather.getForecast(req.params.city, unit)
        .then(data => {
            res.status(200);
            res.send(data)
        })
        .catch(next);
});

app.listen(5000, () => console.log('Example app listening on port 5000!')); //remove ticks if not using template literals