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
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = `${newCity.value}`;
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
  let newTemp = document.querySelector("#today-degree");
  newTemp.innerHTML = temperature;
}
let search = document.querySelector("form");
search.addEventListener("submit", searchCity);

let currentLocation = document.querySelector("button");
currentLocation.addEventListener("click", showCurrentLocation);

let apiKey = "ffb9bb5b2e4c77c5b97eed778979d6bf";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
