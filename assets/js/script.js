var ApiKey = '8fceceef7f0be4b04dce5313fe7967a1'
var days5 = $('.cardD')
var cities = JSON.parse(localStorage.getItem('citiesLi'))
var resultsLi = $('.resultsLi')
$('#searchButton').on('click',function(){
    var city = $('#searchText').val()
    grabWeatherData(city)
})

function displayCities(){
    $('#results').empty()
    if(cities != null){
        while (cities.length > 8){
            cities = JSON.parse(localStorage.getItem('citiesLi'))
            cities.pop();
            localStorage.setItem('citiesLi', JSON.stringify(cities))
        }
        for(i=0; i < cities.length; i++){
            var tempC = cities[i];
            var tempLi = $('<li></li>')
            var tempButton = $('<button></button>').addClass('btn btn-secondary resultsB');
            $('#results').append(tempLi)
            tempButton.appendTo(tempLi)
            tempButton.append(tempC)
       }
       $('.resultsB').on('click', function(){
        var city = $(this).text()
        grabWeatherData(city)
    })
    } else {
       
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
    var iconUrl = 'http://openweathermap.org/img/w/' + icon + '.png'
    var currentTimeUnix = f.daily[0].dt + f.timezone_offset
    var currentTime = moment.unix(currentTimeUnix).format('(MM/D/YYYY)')
    $('#currentDate').text(currentTime)
    $('#currentIcon').attr('src', iconUrl)
    $('#tempF').text(currentTemp)
    $('#windS').text(wind)
    $('#humid').text(humidity)
    $('#UVI').text(uvIndex)
    if (uvIndex <= 2){
        $('#UVI').css('background-color', 'green')
    }else if (2< uvIndex <=5) {
        $('#UVI').css('background-color', 'yellow')
    }else if (5< uvIndex <=7) {
        $('#UVI').css('background-color', 'orange')
    }else if (8 < uvIndex <= 10) {
        $('#UVI').css('background-color', 'red');
    } else {
        $('#UVI').css('background-color', 'purple')
    }

    days5.each(function(i){
        var highT = f.daily[i+1].temp.max + 'ºF'
        var lowT = f.daily[i+1].temp.min + 'ºF'
        var iconD = f.daily[i+1].weather[0].icon
        var iconUrlD = 'http://openweathermap.org/img/w/' + iconD + '.png'
        var windD = f.daily[i+1].wind_speed
        var humidityD = f.daily[i+1].humidity
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

function saveCity (city) {
    if (cities == null){
    cities = []
    cities.unshift(city)
    localStorage.setItem('citiesLi', JSON.stringify(cities))
    displayCities()
    } else {
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
        redirect: 'follow'
    })
    .then(response => response.json())
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

function init (){
displayCities()
city = 'Atlanta'
grabWeatherData(city)
}

init()