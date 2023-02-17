// DOM Selectors to access variables from HTML elements
// Search Inputs 
var citySearchInput = $("#city-search");
var citySearchBtn = $("#city-search-button");
var searchHistoryBtn = $("#clear-history");
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