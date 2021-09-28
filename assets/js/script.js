var ApiKey = '8fceceef7f0be4b04dce5313fe7967a1'
var days5 = $('.cardD')
var cities = JSON.parse(localStorage.getItem('citiesLi'))
var resultsLi = $('.resultsLi')
// passes the city name into the first api search
$('#searchButton').on('click',function(){
    var city = $('#searchText').val()
    grabWeatherData(city)
    $('#searchText').val('')
})
// called on startup to display the side bar of cities in a list of buttons
function displayCities(){
    //clears the list of any appended elements before writing them again
    $('#results').empty()
    if(cities != null){
        // makes sure the array has objects in it and if the array has a length over 8, will trim it down to size
        while (cities.length > 8){
            cities = JSON.parse(localStorage.getItem('citiesLi'))
            cities.pop()
            localStorage.setItem('citiesLi', JSON.stringify(cities))
        }
        // a loop through the whole length of the local storage array of city names and turns them into buttons in a list below the search bar 
        for(i=0; i < cities.length; i++){
            var tempC = cities[i]
            var tempLi = $('<li></li>')
            var tempButton = $('<button></button>').addClass('btn btn-secondary resultsB')
            $('#results').append(tempLi)
            tempButton.appendTo(tempLi)
            tempButton.append(tempC)
       }
        //makes it to where you can click on each of the buttons and pull back up the weather data for that city
       $('.resultsB').on('click', function(){
        var city = $(this).text()
        grabWeatherData(city)
        })
    }
}
//pulls out the lat and lon data to pass on to the real weather call
function pullWeatherData(d){
    var lat = d.coord.lat
    var lon = d.coord.lon
    var city = d.name
    $('#cityName').text(city)
    fullWeatherData(lat,lon)
    saveCity(city)
}
//used for getting the data for todays weather and the next 5 days
function forecastData(f){
    var currentTemp = f.current.temp + 'ºF'
    var uvIndex = f.current.uvi
    var humidity = f.current.humidity
    var wind = f.current.wind_speed + 'MPH'
    var icon = f.current.weather[0].icon
    var iconUrl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png'
    var currentTimeUnix = f.daily[0].dt + f.timezone_offset
    var currentTime = moment.unix(currentTimeUnix).format('(MM/D/YYYY)')
    $('#currentDate').text(currentTime)
    $('#currentIcon').attr('src', iconUrl)
    $('#tempF').text(currentTemp)
    $('#windS').text(wind)
    $('#humid').text(humidity)
    $('#UVI').text(uvIndex)
    // changes the color around the uv index depending on how high it is
        if (uvIndex <= 2){
        $('#UVI').css('background-color', 'green')
        } if (uvIndex >2 && uvIndex <=5) {
        $('#UVI').css('background-color', 'yellow').css('color','black')
        } if (uvIndex >5 && uvIndex <=7) {
        $('#UVI').css('background-color', 'orange')
        } if (uvIndex > 7 && uvIndex <= 10) {
        $('#UVI').css('background-color', 'red')
        } if (uvIndex > 10) {
        $('#UVI').css('background-color', 'purple')
        }
        //a loop that pulls the daily weather data and writes it to each of the 5 day cards below it
    days5.each(function(i){
        var highT = f.daily[i+1].temp.max + 'ºF'
        var lowT = f.daily[i+1].temp.min + 'ºF'
        var iconD = f.daily[i+1].weather[0].icon
        var iconUrlD = 'http://openweathermap.org/img/wn/' + iconD + '@2x.png'
        var windD = f.daily[i+1].wind_speed
        var humidityD = f.daily[i+1].humidity +'%'
        var currentTimeUnixD = f.daily[i+1].dt + f.timezone_offset
        var currentTimeD = moment.unix(currentTimeUnixD).format('MM/D/YYYY')
        $(this).children('.iconD').attr('src', iconUrlD)
        $(this).children('.dateD').text(currentTimeD)
        $(this).children().children('.highT').text(highT)
        $(this).children().children('.lowT').text(lowT)
        $(this).children().children('.windD').text(windD)
        $(this).children().children('.humidityD').text(humidityD)
    })
}
// used for saving the searched city name into the array
function saveCity (city) {
    // checks if the array has no value and sets it as an empty array to then put the searched city into it
    if (cities == null){
    cities = [city]
    localStorage.setItem('citiesLi', JSON.stringify(cities))
    displayCities()
    } else {
        // otherwise makes sure the city isn't already in the array before putting the new value there
        var result = cities.indexOf(city)
        if (result == -1){
        cities.unshift(city)
        localStorage.setItem('citiesLi', JSON.stringify(cities))
        displayCities()
        }
    }
    
}



//grabs the weather data from the city variable
function grabWeatherData(city){
    var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+ApiKey + '&units=imperial'
    fetch(currentUrl , {
        method: 'GET',
        credentials: 'omit',
        redirect: 'follow',
        
    })
    .then(function (response) {
        if (response.status !== 200) {
          alert("please enter valid city name")
        }
        return response.json()
      })
    .then(data => pullWeatherData(data))
}
//pulls all the data for today and the daily section
function fullWeatherData(lat,lon){
    var fullUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=hourly,minutely&appid=' +ApiKey + '&units=imperial'
    fetch(fullUrl , {
        method: 'GET',
        credentials: 'omit',
        redirect:'follow'
    })
    .then(response => response.json())
    .then(data => forecastData(data))
}
// ran on startup so the page doesn't have any empty 
function init (){
displayCities()
    // if there isn't an empty array then the city that is displayed will be the last one searched
    if (cities != null){
    grabWeatherData(cities[0])
    // otherwise the default city will be atlanta on startup
    }else {
        city = 'Atlanta'
        grabWeatherData(city)
    }
}

init()