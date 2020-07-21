const axios = require("axios");

const apiKey = "aB729ECFE4O9";

class WeatherService {
  get(city, unit) {
    if (!city) throw new Error("You must provide a valid city!");

    try {
      return new Promise(async (resolve, reject) => {
        const result = await axios.get(
          "http://someweatherapi.com/api/" + city,
          { apiKey }
        );

        resolve(this.processData(result, unit));
      });
    } catch (err) {
      console.log(err);
    }
  }

  getCityAtTime(city, time) {
    if (!city) throw new Error("You must provide a valid city!");

    return axios.get(
      "http://someweatherapi.com/api/" + city + "?time=" + time,
      { apiKey }
    );
  }

  getForecast(city, unit) {
    let startTime = Date.now();
    let result = [];

    this.getCityAtTime(city, startTime).then(data => {
      result.concat(this.processData(data, unit));

      return this.getCityAtTime(city, startTime - 86400).then(data => {
        result.concat(this.processData(data, unit));

        return this.getCityAtTime(city, startTime - 86400 * 2).then(data => {
          result.concat(this.processData(data, unit));

          return result;
        });
      });
    });
  }

  processData(data, unit = "celsius") {
    let r = [];

    for (var i = 0; i < data.length; i++) {
      const it = data[i];

      if (it.isCertain) {
        for (var j = 0; j < it.readings.length; j++) {
          r.push({
            time: Date.parse(it.time) + 600000 * j,
            value:
              unit === "celsius"
                ? this.fToC(parseInt(it.readings[j]))
                : parseInt(it.readings[j])
          });
        }
      } else {
        continue;
      }
    }

    return r;
  }

  fToC(t) {
    return ((t - 32) * 5) / 9;
  }
}

module.exports = new WeatherService();
