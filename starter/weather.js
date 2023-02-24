// DOM Selectors to access variables from HTML elements
// Search Inputs 
var citySearchInput = $("#city-search");
var citySearchBtn = $("#city-search-button");
var clearHistoryBtn = $("#clear-history");
var searchHistoryList = $("#search-history-list");

// Current Weather 
var currentCity = $("#current-city");
var currentTemperature = $("#current-temperature");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var weatherData = $("#weather-data");

// Open Weather APIKey
var APIkey = "ece4fcb8ee076cc063cd12acb3c19b54";

// To access city data 
var cityList = [];

// Assign and display current date from moment.js
var currentDate = moment().format('ll');
$("#current-date").text("(" + currentDate + ")");

// On click value added to search history
$(document).on("submit", function () {
    event.preventDefault();

    // Value entered into search bar 
    var searchValue = citySearchInput.val().trim();

    currentConditionsRequest(searchValue)
    searchHistory(searchValue);
    citySearchInput.val("");
});


// On click value added to search history
citySearchBtn.on("click", function (event) {
    event.preventDefault();

    // Value entered into search bar 
    var searchValue = citySearchInput.val().trim();

    currentConditionsRequest(searchValue)
    searchHistory(searchValue);
    citySearchInput.val("");
});


// Clear list of cities searched
clearHistoryBtn.on("click", function () {
    // Empty the array
    cityList = [];
    // Update city list history in local storage
    listArray();

    $(this).addClass("hide");
});

// Click button in search history to add the names of cities searched
searchHistoryList.on("click", "li.city-btn", function (event) {
    var value = $(this).data("value");
    currentConditionsRequest(value);
    searchHistory(value);

});

// Request Open Weather API based on user input
function currentConditionsRequest(searchValue) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=metric&appid=" + APIkey;


    // Make AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        currentCity.text(response.name);
        currentCity.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />")
        currentTemperature.text(response.main.temp);
        currentTemperature.append("&deg;C");
        currentHumidity.text(response.main.humidity + "%");
        currentWindSpeed.text(response.wind.speed + " m/sec");

        var lat = response.coord.lat;
        var lon = response.coord.lon;




        //calling from APIKey
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&appid=" + APIkey + "&lat=" + lat + "&lon=" + lon;

        // AJAX call for 5-day forecast
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (response) {
            //console.log(response);
            $('#five-day-forecast').empty();
            for (var i = 1; i < response.list.length; i += 8) {

                var forecastDateString = moment(response.list[i].dt_txt).format("ll");
                //console.log(forecastDateString);

                var forecastCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-3'>");
                var forecastCard = $("<div class='card'>");
                var forecastCardBody = $("<div class='card-body'>");
                var forecastDate = $("<h5 class='card-title'>");
                var forecastIcon = $("<img>");
                var forecastTemp = $("<p class='card-text mb-0'>");
                var forecastWind = $("<p class='card-text mb-0'>");
                var forecastHumidity = $("<p class='card-text mb-0'>");


                $('#five-day-forecast').append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastCardBody);

                forecastCardBody.append(forecastDate);
                forecastCardBody.append(forecastIcon);
                forecastCardBody.append(forecastTemp);

                forecastCardBody.append(forecastWind);
                forecastCardBody.append(forecastHumidity);

                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                forecastIcon.attr("alt", response.list[i].weather[0].main)

                forecastDate.text(forecastDateString);

                forecastTemp.text(response.list[i].main.temp);
                forecastTemp.prepend("Temp: ");
                forecastTemp.append("&deg;C");

                forecastWind.text(response.list[i].wind.speed);
                forecastWind.prepend("Wind: ");
                forecastWind.append(" m/sec ");

                forecastHumidity.text(response.list[i].main.humidity);
                forecastHumidity.prepend("Humidity: ");
                forecastHumidity.append("%");



            }
        });

    });



};

// Display and save the cities searched
function searchHistory(searchValue) {

    // If statement for what happends when cities are searched
    if (searchValue) {
        // Put in the array of cities
        // if it is a new entry
        if (cityList.indexOf(searchValue) === -1) {
            cityList.push(searchValue);

            // List all of the cities from user history
            listArray();
            clearHistoryBtn.removeClass("hide");
            weatherData.removeClass("hide");
        } else {
            // Remove the existing value from the array
            var removeIndex = cityList.indexOf(searchValue);
            cityList.splice(removeIndex, 1);

            // Push the value again to the array
            cityList.push(searchValue);

            // List all of the cities in user history so the old entry appears at the top of the search history
            listArray();
            clearHistoryBtn.removeClass("hide");
            weatherData.removeClass("hide");
        }
    }
    console.log(cityList);
}

