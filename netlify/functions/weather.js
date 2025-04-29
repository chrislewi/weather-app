const axios = require('axios');

exports.handler = async function(event, context) {
  // Retrieve the city parameter from the query string
  const city = event.queryStringParameters.city;

  // If no city parameter is provided, return a 400 error
  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'City parameter is required.' })
    };
  }

  // Retrieve the API key from environment variables for security
  const apiKey = process.env.WEATHER_API_KEY;  // Use environment variable for the API key

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Weather API key is missing.' })
    };
  }

  try {
    // Fetch weather data from the WeatherAPI
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`);

    // Extract necessary data from the response
    const data = response.data;

    // Return the weather data
    return {
      statusCode: 200,
      body: JSON.stringify({
        city: data.location.name,
        country: data.location.country,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
      })
    };
  } catch (error) {
    console.error('Weather API request failed:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data.' })
    };
  }
};
