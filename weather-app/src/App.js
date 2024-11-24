import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [latitude, setLatitude] = useState(process.env.REACT_APP_DEFAULT_LATITUDE || "");
  const [longitude, setLongitude] = useState(process.env.REACT_APP_DEFAULT_LONGITUDE || "");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=3`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch weather data.");
      }
      const data = await response.json();
      setWeatherData(data.hourly);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      setError("Please enter valid latitude and longitude values.");
      return;
    }

    fetchWeather();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
      </header>

      <main className="App-main">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="App-input"
          />
          <input
            type="text"
            placeholder="Enter Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="App-input"
          />
          <button type="submit" className="App-button">
            Get Weather
          </button>
        </form>

        {error && <p className="App-error">{error}</p>}
        {loading && <p>Loading weather data...</p>}

        {weatherData && (
          <div className="App-weather-display">
            <h2>Hourly Temperatures</h2>
            <ul>
              {weatherData.time.map((time, index) => (
                <li key={index}>
                  <strong>{time}:</strong> {weatherData.temperature_2m[index]} °C
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
