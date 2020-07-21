const express = require("express");
const app = express();
const Weather = require("./lib/service");

let unit = "celsius";

app.get("/weather/set-units/:unit", req => {
  unit = req.params.unit;
  res.send("OK!");
});

app.get("/weather/:city", (req, res) =>
  Weather.get(req.params.city, unit).then(data => {
    res.send(data);
  })
);

app.get("/weather/forecast/:city", (req, res) => {
  Weather.getForecast(req.params.city, unit).then(data => res.send(data));
});

app.listen(5000, () => console.log(`Example app listening on port 5000!`));
