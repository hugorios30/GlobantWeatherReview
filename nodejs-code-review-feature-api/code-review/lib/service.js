const axios = require('axios');

const apiKey = 'aB729ECFE4O9';

const { API_URL, DEFAULT_UNIT } = require('../constants');



class WeatherService {
    async get(city, unit) {
        //set whole function as a promise first to reject promise if necessary
        if (!city) {
            throw new Error('You must provide a valid city!'); //reject promise if city not provided
        }
        try {
            const result = await axios.get(`${API_URL}${city}`, {
                params: { apiKey } //specify params for better reading
            });
            return this.processData(result, unit);
        } catch (err) {
            console.log(err);
            throw err; //log the error but also reject the promise if the api call fails
        }

    }

    async getCityAtTime(city, time) {
        if (!city) {
            throw new Error('You must provide a valid city!');
        }
        try { //Wrap in a try catch block in case api call fails, dont break the flow
            const result = await axios.get(`${API_URL}${city}`, {
                params: {
                    apiKey,
                    time
                }
            });
            return result
        } catch (err) {
            console.log(err);
            throw err;
        }

    }

    async getForecast(city, unit) {
        let startTime = Date.now();
        let result = [];
        try {
            const forecast = await this.getCityAtTime(city, startTime);
            const forecastYesterday = await this.getCityAtTime(city, startTime - 86400);
            const forecastPastYesterday = await this.getCityAtTime(city, startTime - 86400 * 2);
            result.concat(this.processData(forecast, unit));
            result.concat(this.processData(forecastYesterday, unit));
            result.concat(this.processData(forecastPastYesterday, unit));
        } catch (err) {
            console.log(err);
            throw err;
        }

        return result;
    }

    processData(data, unit = DEFAULT_UNIT) {
        let response = []; //change variable name to not confuse

        for (let item of data) { //minimize code by using for( item of data)
            if (!item.isCertain) {
                continue;
            }
            item.readings.forEach((r) => { //using foreach loop to minimize code
                response.push({
                    time: Date.parse(item.time) + 600000 * r,
                    value: unit !== DEFAULT_UNIT ? this.fToC(parseInt(r)) : parseInt(r) // use different in order to make conversion correctly
                })
            })
        }

        return response;
    }

    fToC(t) {
        return ((t - 32) * 5 / 9); //use of parenthesis could cause different result
    }
}

module.exports = new WeatherService();