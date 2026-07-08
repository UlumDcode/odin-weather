// const API_KEY = "0b3d63e0ab629ee4747ed06606b4e864";
// const API_URL = "https://api.openweathermap.org/data/2.5";
import "./style.css";
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_BASE_URL;

async function getCurrentWeather(city) {
  const url = `${API_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Kota tidak ditemukan");
  }

  const data = await response.json();
  return data;
}

async function getForecast(city) {
  const url = `${API_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("forecast tidak tersedia");
  }

  const data = await response.json();
  return data;
}

function renderCurrentWeather(data) {
  const cityName = document.getElementById("city-name");
  const date = document.getElementById("date");
  const temperature = document.getElementById("temperature");
  const description = document.getElementById("weather-description");
  const feelsLike = document.getElementById("feels-like");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("wind-speed");
  const weatherIcon = document.getElementById("weather-icon");
  const currentWeatherSection = document.getElementById("current-weather");

  cityName.textContent = data.name;
  date.textContent = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  feelsLike.textContent = ` ${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = ` ${data.main.humidity}%`;
  windSpeed.textContent = ` ${data.wind.speed} m/s`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  currentWeatherSection.classList.remove("hidden");
}

getCurrentWeather("jakarta")
  .then((data) => {
    renderCurrentWeather(data);
  })
  .catch((error) => {
    console.error("Gagal memuat data cuaca:", error);
  });

function renderForecast(data) {
  const forecastContainer = document.getElementById("forecast-container");
  const forecastSection = document.getElementById("forecast");

  forecastContainer.innerHTML = "";

  for (let i = 0; i < data.list.length; i += 7) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000);
    const dayName = date.toLocaleDateString("id-ID", {
      weekday: "short",
    });
    const temp = Math.round(forecast.main.temp);
    const icon = forecast.weather[0].icon;
    const desc = forecast.weather[0].description;

    const card = document.createElement("div");
    card.className = "forecast-card";

    card.innerHTML = `
    <p class='day'>${dayName}</p>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
    <p class="temp">${temp}°C</p>
    `;

    forecastContainer.appendChild(card);
  }
  forecastSection.classList.remove("hidden");
}

getForecast("jakarta")
  .then((data) => {
    renderForecast(data);
  })
  .catch((err) => {
    console.error("Gagal memuat data forecast:", err);
  });
