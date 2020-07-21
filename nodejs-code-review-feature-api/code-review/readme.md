# Weather application code review test.

## Objectives

Provide a code review for this pull request.

Comments may range on everything from style, scalability, antipatterns, etc. It's completely up to you! **It's not necessary for you to clone or run this repository**, we just want you to provide feedback to see your ability to detect issues and raise red flags.

## The application

This is an obviously fake, small weather API that could be in production today.
It consists in 3 endpoints that consume an API and process the data in a way that it's relevant to us.

You can see sample data from the underlying service being consumed at `sample_data.json` and for the output our endpoints produce, `output.json`.

The endpoints are as follows:

### GET /weather/set-unit/:unit

Sets a unit to get your results in. (e.g: `celsius`, `fahrenheit`)

### GET /weather/:city

Retrieves a fake service and returns the data formatted for using in our app (for example, time series data for graphing).

### GET /weather/forecast/:city

Retrieves the same data as the previous endpoint, but for 3 days.
