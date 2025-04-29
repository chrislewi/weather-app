require('dotenv').config({ path: './weather.env' }); // Specify the custom file name
const apiKey = process.env.APP_WEATHER_API_KEY;

if (!apiKey) {
  console.error('API key is missing in environment variables');
}
const fetch = require('node-fetch'); // To make the weather API request

exports.handler = async function(event, context) {
  const { city } = event.queryStringParameters;

  // Validate the city parameter
  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: { message: 'City parameter is required' } })
    };
  }

  try {
    // Fetch weather data from the API
    const apiKey = process.env.APP_WEATHER_API_KEY; // Use the correct environment variable
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: { message: 'API key is missing in environment variables' } })
      };
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=3`;
    const response = await fetch(url);

    // Check for HTTP errors
    if (!response.ok) {
      const errorData = await response.json(); // Parse the error response
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorData })
      };
    }

    const data = await response.json();

    // Respond with weather data
    return {
      statusCode: 200,
      body: JSON.stringify({
        city: data.location.name,
        country: data.location.country,
        condition: data.current.condition.text,
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        icon: data.current.condition.icon,
        forecast: data.forecast.forecastday.map(day => ({
          date: day.date,
          condition: day.day.condition.text,
          icon: day.day.condition.icon,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c
        }))
      })
    };
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: 'Error fetching weather data', details: error.message } })
    };
  }
};


