function formatDate(timestamp) {
  let currentDate = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tueday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentDate.getDay()];
  let hour = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hour}:${minutes}`;
}

function formatForecastDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function displayForecast(response) {
  console.log(response);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
        <div class="card" style="width: 12rem">
          <div class="card-body">
            <h5 class="card-title">${formatForecastDate(forecastDay.dt)}</h5>
            <img
              src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              width="65px"
            />
            <p class="card-text">
              ${Math.round(
                forecastDay.temp.max
              )}°c | <span class="temperature-min">${Math.round(
          forecastDay.temp.min
        )}°c</span><br />
            </p>
          </div>
        </div>`;
    }
  });
  forecastHTML =
    forecastHTML +
    `</div><p class="end">
      <a href="https://github.com/taylorrebecca3/my-weather-app" target="_blank"
        >Open-source code</a
      >
      by Rebecca Taylor
    </p>`;
  forecastElement.innerHTML = forecastHTML;
}

function searchCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#city-search");

  axios
    .get(`${apiUrl}q=${newCity.value}&units=metric&appid=${apiKey}`)
    .then(showTemperature);
}
function showCurrentLocation(event) {
  navigator.geolocation.getCurrentPosition(showLocation);
}
function showLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let url = `${apiUrl}lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showTemperature);
  axios.get(url).then(changeCity);
}
function changeCity(response) {
  let currentLocation = response.data.name;
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = currentLocation;
}

function showTemperature(response) {
  celsiusTemperature = response.data.main.temp;
  let newTemp = (document.querySelector("#today-degree").innerHTML =
    Math.round(celsiusTemperature));
  let newCity = response.data.name;
  let currentCity = (document.querySelector("#current-city").innerHTML =
    newCity);
  let currentHumidity = response.data.main.humidity;
  let humidity = (document.querySelector("#humidity").innerHTML =
    currentHumidity);
  let currentWind = Math.round(response.data.wind.speed);
  let wind = (document.querySelector("#wind").innerHTML = currentWind);
  let currentDescription = response.data.weather[0].main;
  let description = (document.querySelector("#description").innerHTML =
    currentDescription);
  let currentDate = document.querySelector("#current-date");
  let currentIcon = document.querySelector("#current-icon");
  currentIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  let date = (document.querySelector("#current-date").innerHTML = formatDate(
    response.data.dt * 1000
  ));
  getForecast(response.data.coord);
}
function getForecast(coordinates) {
  let newUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(newUrl).then(displayForecast);
}
function showFirstCity(city) {
  axios
    .get(`${apiUrl}q=${city}&units=metric&appid=${apiKey}`)
    .then(showTemperature);
}

let search = document.querySelector("form");
search.addEventListener("submit", searchCity);

let currentLocation = document.querySelector("button");
currentLocation.addEventListener("click", showCurrentLocation);

let apiKey = "ffb9bb5b2e4c77c5b97eed778979d6bf";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";

showFirstCity("Toronto");
