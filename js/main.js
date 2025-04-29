document.getElementById('weather-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevent form submission

    // Get the city entered by the user
    const city = document.getElementById('city').value.trim();
    if (!city) return;

    try {
        // Show loading message
        const loadingDiv = document.getElementById('loading');
        const weatherDiv = document.getElementById('weather');
        loadingDiv.style.display = 'block';
        weatherDiv.style.display = 'none';

        // Fetch weather data from the Netlify serverless function
        const response = await fetch(`/.netlify/functions/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (data.error) {
            // Display error message if there is an issue with the weather data
            alert(data.error.message || data.error || 'Error fetching weather data');
        } else {
            // Update UI with weather information
            document.getElementById('weather-city').textContent = `${data.city}, ${data.country}`;
            document.getElementById('current-icon').src = "https:" + data.icon;
            document.getElementById('current-icon').alt = data.condition;
            document.getElementById('weather-condition').textContent = `Condition: ${data.condition}`;
            document.getElementById('weather-temp').textContent = `Temperature: ${data.temperature}°C`;
            document.getElementById('weather-humidity').textContent = `Humidity: ${data.humidity}%`;
            document.getElementById('weather-wind').textContent = `Wind Speed: ${data.windSpeed} km/h`;

            // Populate the forecast
            const forecastDiv = document.getElementById('forecast');
            forecastDiv.innerHTML = '';
            data.forecast.forEach(day => {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'forecast-day';
                dayDiv.innerHTML = `
                    <strong>${day.date}</strong><br/>
                    <img src="https:${day.icon}" class="weather-icon" alt="${day.condition}" /><br/>
                    ${day.condition}<br/>
                    Max: ${day.maxTemp}°C, Min: ${day.minTemp}°C
                `;
                forecastDiv.appendChild(dayDiv);
            });

            // Show the weather div
            weatherDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again later.');
    } finally {
        // Hide loading message
        document.getElementById('loading').style.display = 'none';
    }
});
