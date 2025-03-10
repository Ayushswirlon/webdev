document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityName = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const descriptionDisplay = document.getElementById("description");
  const errorMessage = document.getElementById("error-message");
  const API_KEY = "your_api_key(for security i remove the api)";

  getWeatherBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return;

    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      showError();
    }
  });

  async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    // console.log(response);
    if (!response.ok) {
      throw new Error("city not found");
    }
    const data = await response.json();
    return data;
  }
  function displayWeatherData(data) {
    console.log(data);
    const { name, main, weather } = data;
    cityName.textContent = name;
    temperatureDisplay.textContent = `temperatuer: ${main.temp}`;
    descriptionDisplay.textContent = `pressure: ${main.pressure} \n
    Discription: ${weather[0].description}`;
    weatherInfo.classList.remove("hidden");
  }
  function showError() {
    weatherInfo.classList.add("hidden");
    errorMessage.classList.remove("hidden");
  }
});
