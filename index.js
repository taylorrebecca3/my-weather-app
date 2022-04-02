function getCurrentTime() {
  let currentDate = new Date();

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
  let currentTime = document.querySelector("#current-date");
  currentTime.innerHTML = `${day} ${hour}:${minutes}`;
}
getCurrentTime();

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
  let temperature = Math.round(response.data.main.temp);
  let newTemp = (document.querySelector("#today-degree").innerHTML =
    temperature);
  let newCity = response.data.name;
  let currentCity = (document.querySelector("#current-city").innerHTML =
    newCity);
  let currentHumidity = response.data.main.humidity;
  let humidity = (document.querySelector("#humidity").innerHTML =
    currentHumidity);
  let currentWind = Math.round(response.data.wind.speed);
  let wind = (document.querySelector("#wind").innerHTML = currentWind);
  console.log(response);
  let currentDescription = response.data.weather[0].main;
  let description = (document.querySelector("#description").innerHTML =
    currentDescription);
  let currentDate = document.querySelector("#current-date");
  let currentIcon = document.querySelector("#current-icon");
  currentIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}
let search = document.querySelector("form");
search.addEventListener("submit", searchCity);

let currentLocation = document.querySelector("button");
currentLocation.addEventListener("click", showCurrentLocation);

let apiKey = "ffb9bb5b2e4c77c5b97eed778979d6bf";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
