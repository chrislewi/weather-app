document.getElementById('weatherForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevent form submission

    // Get the city entered by the user
    const city = document.getElementById('city').value;

    try {
        // Fetch weather data from the Netlify serverless function
        const response = await fetch(`/api/weather?city=${city}`);
        const data = await response.json();

        if (data.error) {
            // Display error message if there is an issue with the weather data
            document.getElementById('weatherResult').innerHTML = `<p>Error: ${data.error}</p>`;
        } else {
            // Display weather information
            document.getElementById('weatherResult').innerHTML = `
                <h2>${data.city}, ${data.country}</h2>
                <p>Condition: ${data.condition}</p>
                <img src="${data.icon}" alt="${data.condition}">
                <p>Temperature: ${data.temperature}°C</p>
                <p>Humidity: ${data.humidity}%</p>
                <p>Wind Speed: ${data.windSpeed} km/h</p>
            `;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherResult').innerHTML = `<p>Error: Failed to fetch weather data.</p>`;
    }
});
