import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "./App.css";
import rain from "./assets/images/rain.png";
import humidity from "./assets/images/humidity.png";
import wind from "./assets/images/wind.png";
import cloud from "./assets/images/clouds.png";
import clear from "./assets/images/clear.png";
import drizzle from "./assets/images/drizzle.png";
import mist from "./assets/images/mist.png";
import clock from "./assets/images/recentclock.jpg";

const weatherIcons = {
  Rain: rain,
  Humidity: humidity,
  Wind: wind,
  Clouds: cloud,
  Clear: clear,
  Drizzle: drizzle,
  Mist: mist,
  Smoke: humidity,
};

const apiKey = "287b189f4c5abe09cef5d69f376f5838";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

function App() {
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("metric");
  const [weatherData, setWeatherData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentOpen, setRecentOpen] = useState(false);
  const inputRef = useRef(null);
  const [relatedSearches, setRelatedSearches] = useState([]);

  useEffect(() => {
    const savedRecentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedRecentSearches);

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const searchWeather = async () => {
    try {
      if (city.trim() === "") {
        alert("Please enter a city name");
        return;
      }

      const queryString = `q=${city}&units=${unit}&appid=${apiKey}`;
      const response = await fetch(`${apiUrl}?${queryString}`);

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      setWeatherData(data);
      addRecentSearch(city);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setRecentOpen(false);
    }
  };

  const addRecentSearch = (search) => {
    
    if (!recentSearches.includes(search)) {
      
      const updatedRecentSearches = [search, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedRecentSearches);
      localStorage.setItem(
        "recentSearches",
        JSON.stringify(updatedRecentSearches)
      );
    } 
  };
  const handleUnitChange = (e) => {
    setUnit(e.target.value);
    searchWeather();
  };

  const handleRecentSearchClick = (search) => {
    setCity(search);
  };

  return (
    <div className="App container mt-5">
      <h1 className="mb-4">Weather App</h1>
      <div className="input-group mb-3 position-relative ">
        <input
          type="text"
          className="form-control"
          placeholder="Enter city"
          value={city}
          onClick={() => setRecentOpen(true)}
          onChange={(e) => setCity(e.target.value)}
        
          ref={inputRef}
        />
        <div className="input-group-append ">
          <button
            className="btn btn-primary"
            type="button"
            onClick={searchWeather}
          >
            Search
          </button>
        </div>

        <div
          className={`${
            city || recentOpen != true ? "d-none" : "d-block"
          } recent-searches  position-absolute w-100`}
          style={{ top: "20px" }}
        >
          <div>Recent Searches:</div>

          {recentSearches.map((search, index) => (
            <span
              key={index}
              className="recent-search"
              onClick={() => handleRecentSearchClick(search)}
            >
              <div className="d-flex  gap-4 px-3  rounded-4 mb-1 recent-search">
                <span className="rounded-circle overflow-hidden">
                  <img src={clock} width={"27px"}></img>
                </span>
                {search}
              </div>
            </span>
          ))}
        </div>
      </div>

      <div className="weather-result">
        {weatherData && (
          <>
            <img
              className="weather-icon"
              src={weatherIcons[weatherData.weather[0].main]}
              alt={weatherData.weather[0].description}
            />
            <h2>{`${weatherData.name}, ${weatherData.sys.country}`}</h2>
            <p
              style={{ fontSize: "1.2rem", fontWeight: "500" }}
            >{`Temperature: ${weatherData.main.temp} ${
              unit === "metric" ? "°C" : "°F"
            }`}</p>
            <p
              style={{ fontSize: "1rem", fontWeight: "500" }}
            >{`Weather: ${weatherData.weather[0].description}`}</p>
            <div className="details">
              <div className="col">
                <img src={humidity}></img>
                <div className="humidity">
                  <p
                    style={{ fontSize: "1rem", fontWeight: "500" }}
                  >{`Humidity: ${weatherData.main.humidity} %`}</p>
                </div>
              </div>
              <div className="col">
                <img src={wind}></img>
                <div className="wind">
                  <p
                    style={{ fontSize: "1rem", fontWeight: "500" }}
                  >{`Wind Speed: ${weatherData.wind.speed} m/s`}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="unit"
          value="metric"
          checked={unit === "metric"}
          onChange={handleUnitChange}
        />
        <label className="form-check-label">Celsius</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="unit"
          value="imperial"
          checked={unit === "imperial"}
          onChange={handleUnitChange}
        />
        <label className="form-check-label">Fahrenheit</label>
      </div>
    </div>
  );
}

export default App;
