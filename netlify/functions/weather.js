const axios = require('axios');

exports.handler = async function(event, context) {
  const city = event.queryStringParameters.city;

  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'City parameter is required.' })
    };
  }

  const apiKey = 'YOUR_WEATHERAPI_KEY';  // Replace with your actual API key

  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`);
    const data = response.data;

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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data.' })
    };
  }
};
