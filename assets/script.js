var apiKey = "f57081fe0af437b3810f6e16f828ba1c";
var today = moment();


// Select elements from html and assign to variables
var city = document.querySelector(".display-city");
var forecastDiv = document.querySelector(".forecast");
var searchBtn = document.querySelector(".search-Btn");
var userCity = document.querySelector(".city-search");
var forecastHeader = document.querySelector(".forecast-header");
var searchHistory = document.querySelector(".search-history");

// Create & style new elements to be used in displaying fetched weather info
var cityName = document.createElement("h2");
var temp = document.createElement("p");
temp.classList.add("temps");
var maxMin = document.createElement("p");
maxMin.classList.add("temps");
var wind = document.createElement("p");
var humidity = document.createElement("p");
var uvIndex = document.createElement("p");
var icon = document.createElement("img");
// Append new elements to document
city.appendChild(cityName);
city.appendChild(icon);
city.appendChild(temp);
city.appendChild(maxMin);
city.appendChild(wind);
city.appendChild(humidity);
city.appendChild(uvIndex);

//Fetch current weather api
function getCity(city) {
    var currentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
    return fetch(currentWeather)
        .then(response => response.json())


}

// Fetch onecall api for forecast
function forecast(long, lat) {
    var forecastWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=metric&appid=" + apiKey;
    return fetch(forecastWeather)
        .then(response => response.json());
}

// Saving cityName into array of strings
function saveSearch (cityName) {
    var searchItems = JSON.parse(localStorage.getItem("searchItems")) || [];
    searchItems.push(cityName);
    localStorage.setItem("searchItems", JSON.stringify(searchItems));
}

// Get data from localstorage for search history
function populateHistory () {
    var searchItems = JSON.parse(localStorage.getItem("searchItems")) || [];
    for (const element of searchItems) {
        createHistoryButton(element);
        
        
      }
}

// Create search history labels/buttons
function createHistoryButton (cityName) {
    var historyItem = document.createElement("button");
    historyItem.classList.add("btn", "btn-dark");
    historyItem.textContent = cityName;
    historyItem.addEventListener("click", function (event) {
        event.preventDefault();
        fetchForecast(cityName, false)
    })
    searchHistory.appendChild(historyItem);
    
}

function fetchForecast (search, createBtn) {
    // User input passed to getCity function to get data of corresponding city
    $(".forecast").empty();

    getCity(search).then(function (weather) {
        console.log(weather);
        if (createBtn) createHistoryButton (weather.name);
        if (createBtn) saveSearch (weather.name);
        //Display data
        cityName.textContent = weather.name + " - " + today.format("DD/MM/YY");
        icon.src = "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";
        temp.textContent = "Currently: " + weather.main.temp + "°C";
        wind.textContent = "Wind: " + weather.wind.speed + " m/s";
        humidity.textContent = "Humidity: " + weather.main.humidity + "%";
        

        // Pass in city coordinates (obtained from current weather api fetch) then display forecast weather data
        return forecast(weather.coord.lon, weather.coord.lat)
    }).then(function (forecastData) {
        console.log(forecastData);
        forecastHeader.textContent = "Forecast:";
        uvIndex.textContent = "UV Index: " + forecastData.current.uvi;
        // Colour code uv index per severity
        if (forecastData.current.uvi < 6) {
            uvIndex.setAttribute("style", "background-color: green");
        } else if (forecastData.current.uvi < 9) {
            uvIndex.setAttribute("style", "background-color: orange;",)
        } else {
            uvIndex.setAttribute("style", "background-color: red");
        }
        maxMin.textContent = "Max: " + forecastData.daily[0].temp.max + "°C / Min: " + forecastData.daily[0].temp.min + "°C";
        // Loop through 'daily' weather data from one call api to make 5 day forecast cards
        for (var i = 1; i < 6; i++) {
            
            // Create & style card elements
            var forecastCard = document.createElement("div");
            forecastCard.classList.add("col", "forecast-card");
            var forecastDate = document.createElement("h4");
            var forecastIcon = document.createElement("img");
            var forecastMax = document.createElement("p");
            var forecastMin = document.createElement("p");
            forecastMax.classList.add("temps");
            forecastMin.classList.add("temps");
            var forecastWind = document.createElement("p");
            var forecastHumidity = document.createElement("p");
            // Append text elements to card
            forecastCard.appendChild(forecastDate);
            forecastCard.appendChild(forecastIcon);
            forecastCard.appendChild(forecastMax);
            forecastCard.appendChild(forecastMin);
            forecastCard.appendChild(forecastWind);
            forecastCard.appendChild(forecastHumidity);
            // Append card to forecast div
            forecastDiv.appendChild(forecastCard);
            // Set text content as fetched weather forecast data
            var reformatDate = moment.unix(forecastData.daily[i].dt).format("DD/MM/YY");
            forecastDate.textContent = reformatDate;
            forecastIcon.src = "http://openweathermap.org/img/w/" + forecastData.daily[i].weather[0].icon + ".png";
            forecastMax.textContent = "Max: " + forecastData.daily[i].temp.max + "°C";
            forecastMin.textContent = "Min: " + forecastData.daily[i].temp.min + "°C";
            forecastWind.textContent = "Wind: " + forecastData.daily[i].wind_speed + " m/s";
            forecastHumidity.textContent = "Humidity: " + forecastData.daily[i].humidity + "%";
            


        }
        

    })

}

searchBtn.addEventListener("click",  function(event) {
    event.preventDefault();
    // get user input 
    var search = userCity.value;
    if (search === "") {
        window.alert("Please enter a city name.")
        return
        
    }
    fetchForecast(search, true)
});

populateHistory ();