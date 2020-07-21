const axios = require("axios");

const apiKey = "aB729ECFE4O9";

const API_URL = "http://someweatherapi.com/api/"; //use of const for api url

class WeatherService {
    get(city, unit) {
        //set whole function as a promise first to reject promise if necessary
        return new Promise(async(resolve, reject) => {
            if (!city) {
                reject("You must provide a valid city!"); //reject promise if city not provided
            }
            try {
                const result = await axios.get(`${API_URL}${city}`, {
                    params: { apiKey } //specify params for better reading
                });
                resolve(this.processData(result, unit));
            } catch (err) {
                console.log(err);
                reject(err); //log the error but also reject the promise if the api call fails
            }
        });
    }

    getCityAtTime(city, time) {
        return new Promise(async(resolve, reject) => {
            if (!city) {
                reject("You must provide a valid city!");
            }
            try { //Wrap in a try catch block in case api call fails, dont break the flow
                const result = await axios.get(`${API_URL}${city}`, {
                    params: {
                        apiKey,
                        time
                    }
                });
                resolve(result)
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    getForecast(city, unit) {
        return new Promise((resolve, reject) => {
            let startTime = Date.now();
            let result = [];
            this.getCityAtTime(city, startTime)
                .then(data => {
                    result.concat(this.processData(data, unit));
                    return this.getCityAtTime(city, startTime - 86400);
                }).then(data => {
                    result.concat(this.processData(data, unit));
                    return this.getCityAtTime(city, startTime - 86400 * 2);
                })
                .then(data => {
                    result.concat(this.processData(data, unit));
                    resolve(result);
                })
                .catch(err => {
                    reject(err)
                }); //chained promises will run syncronously and give the exact response at index controller
        });
    }

    processData(data, unit = "celsius") {
        let response = []; //change variable name to not confuse

        for (let item of data) { //minimize code by using for( item of data)
            if (item.isCertain) {
                item.readings.forEach((r) => { //using foreach loop to minimize code
                    response.push({
                        time: Date.parse(item.time) + 600000 * r,
                        value: unit !== "celsius" ? this.fToC(parseInt(r)) : parseInt(r) // use different in order to make conversion correctly
                    })
                })
            } else {
                continue;
            }
        }

        return response;
    }

    fToC(t) {
        return ((t - 32) * 5 / 9); //use of parenthesis could cause different result
    }
}

module.exports = new WeatherService();