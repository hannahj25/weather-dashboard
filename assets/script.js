var apiKey = "f57081fe0af437b3810f6e16f828ba1c";
var today = moment();


// Select elements from html and assign to variables
var city = document.querySelector(".display-city");
var forecastDiv = document.querySelector(".forecast");
var searchBtn = document.querySelector(".search-Btn");
var userCity = document.querySelector(".city-search");
var forecastHeader = document.querySelector(".forecast-header");

// Create new elements to be used in displaying fetched weather info

var cityName = document.createElement("h2");
var temp = document.createElement("p");
var maxMin = document.createElement("p");
var wind = document.createElement("p");
var humidity = document.createElement("p");
var uvIndex = document.createElement("p");
var icon = document.createElement("img");
// append new elements to document
city.appendChild(cityName);
city.appendChild(icon);
city.appendChild(temp);
city.appendChild(maxMin);
city.appendChild(wind);
city.appendChild(humidity);
city.appendChild(uvIndex);


function getCity(city) {
    var currentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
    return fetch(currentWeather)
        .then(response => response.json())


}

function forecast(long, lat) {
    var forecastWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=metric&appid=" + apiKey;
    return fetch(forecastWeather)
        .then(response => response.json());
}


searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
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
        wind.textContent = "Wind: " + weather.wind.speed + " m/s";
        humidity.textContent = "Humidity: " + weather.main.humidity + "%";

        // to get weather data
        // display data
        return forecast(weather.coord.lon, weather.coord.lat)
    }).then(function (forecastData) {
        console.log(forecastData);
        forecastHeader.textContent = "5-Day Forecast:";
        uvIndex.textContent = "UV Index: " + forecastData.current.uvi;
        if (forecastData.current.uvi < 6) {
            uvIndex.setAttribute("style", "background-color: green");
        } else if (forecastData.current.uvi < 9) {
            uvIndex.setAttribute("style", "background-color: orange;",)
        } else {
            uvIndex.setAttribute("style", "background-color: red");
        }
        for (var i = 1; i < 6; i++) {
            var forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-card", "col");
            var forecastDate = document.createElement("h4");
            var forecastIcon = document.createElement("img");
            var forecastTemp = document.createElement("p");
            var forecastWind = document.createElement("p");
            var forecastHumidity = document.createElement("p");
            // append info to card
            forecastCard.appendChild(forecastDate);
            forecastCard.appendChild(forecastIcon);
            forecastCard.appendChild(forecastTemp);
            forecastCard.appendChild(forecastWind);
            forecastCard.appendChild(forecastHumidity);
            forecastDiv.appendChild(forecastCard);
            // set text content as fetched weather forecast data
            var reformatDate = moment(forecastData.daily[i].dt).format("DD/MM/YY");
            console.log(reformatDate);
            forecastDate.textContent = reformatDate;
            forecastTemp.textContent = "Temperature: " + forecastData.daily[i].temp.day;
            forecastWind.textContent = "Wind: " + forecastData.daily[i].wind_speed + " m/s";
            forecastHumidity.textContent = "Humidity: " + forecastData.daily[i].humidity + "%";


        }

    })


})

