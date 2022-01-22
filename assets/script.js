var apiKey = "f57081fe0af437b3810f6e16f828ba1c";
var today = moment();



// Select elements from html and assign to variables
var city = document.querySelector(".display-city");
var forecastDiv = document.querySelector(".forecast");
var searchBtn = document.querySelector(".search-Btn");
var userCity = document.querySelector(".city-search");

// Create new elements to be used in displaying fetched weather info

var cityName = document.createElement("h2");
var temp = document.createElement("p");
var maxMin = document.createElement ("p");
var wind = document.createElement("p");
var humidity = document.createElement("p");
var uvIndex = document.createElement("p");
var icon = document.createElement("p");
// append new elements to document
city.appendChild(cityName);
city.appendChild(icon);
city.appendChild(temp);
city.appendChild(maxMin);
city.appendChild(wind);
city.appendChild(humidity);
city.appendChild(uvIndex);


function getCity (city) {
    var currentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
    return fetch(currentWeather)
    .then(response => response.json())
    
    
}

function forecast (long, lat) {
    var forecastWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=metric&appid=" + apiKey;
    return fetch(forecastWeather)
    .then(response => response.json());
}

searchBtn.addEventListener("click", function (event) {
    event.preventDefault ();
    // get user input 
    var search = userCity.value;
    if (search === "") {
        window.alert("Please enter a city name.")
        return
    } 

    // pass to getcity function 
    getCity(search).then(function (weather) {
        console.log(weather);
        cityName.textContent = weather.name + " - " + today.format("DD/MM/YY");
        temp.textContent = "Current temperature: " + weather.main.temp + "°C"
        wind.textContent = "Wind: " + weather.wind.speed + " KPH";
        humidity.textContent = "Humidity: " + weather.main.humidity + "%";

          // to get weather data
         // display data
         return forecast (weather.coord.lon, weather.coord.lat)
    }).then(function(forecastData) {
        console.log(forecastData);
        uvIndex.textContent = "UV Index: " + forecastData.current.uvi;

    })
    
    
})

// function toCelsius (kelvin) {
//     return kelvin - 273.15;
// }