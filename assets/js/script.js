var ApiKey = '8fceceef7f0be4b04dce5313fe7967a1';
var days5 = $(".cardD")
var cities = JSON.parse(localStorage.getItem(cities));
console.log(days5)
$('#searchButton').on("click",function(){
    var textInput = $('#searchText').val();
    city = textInput;
    grabWeatherData();
})



//pulls out the lat and lon data to pass on to the real weather call
function pullWeatherData(d){
    var lat = d.coord.lat;
    var lon = d.coord.lon;
    var city = d.name;
    $("#cityName").text(city);
    fullWeatherData(lat,lon);
    saveCity(city);
}
//used for getting the data for todays weather and the next 5 days
function forecastData(f){
    var currentTemp = f.current.temp + "ºF";
    var uvIndex = f.current.uvi;
    var humidity = f.current.humidity;
    var wind = f.current.wind_speed + "MPH";
    var currentTimeUnix = f.current.dt + f.timezone_offset;
    var currentTime = moment.unix(currentTimeUnix).format("(MM/D/YYYY)")
    $('#currentDate').text(currentTime)
    $('#tempF').text(currentTemp)
    $('#windS').text(wind)
    $('#humid').text(humidity)
    $('#UVI').text(uvIndex)

    days5.each(function(i){
        var highT = f.daily[i+1].temp.max + "ºF";
        var lowT = f.daily[i+1].temp.min + "ºF";
        var windD = f.daily[i+1].wind_speed
        var humidityD = f.daily[i+1].humidity
        var currentTimeUnixD = f.daily[i+1].dt + f.timezone_offset;
        var currentTimeD = moment.unix(currentTimeUnixD).format("MM/D/YYYY")
        $(this).children('.dateD').text(currentTimeD);
        $(this).children().children('.highT').text(highT);
        $(this).children().children('.lowT').text(lowT);
        $(this).children().children('.windD').text(windD);
        $(this).children().children('.humidityD').text(humidityD);
    })
    console.log(f);
}

function saveCity (city) {
    if (cities == null){
    cities = [city];
    } else {
    cities.unshift(city)
    }
    localStorage.setItem("citiesLi", JSON.stringify(cities))
    displayCities();
}



//grabs the weather data from the city variable
function grabWeatherData(){
    var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+ApiKey + '&units=imperial';
    fetch(currentUrl , {
        method: 'GET',
        credentials: 'omit',
        redirect: 'follow'
    })
    .then(response => response.json())
    .then(data => pullWeatherData(data));
}
//pulls all the data for today and the daily section
function fullWeatherData(lat,lon){
    var fullUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=hourly,minutely&appid=' +ApiKey + '&units=imperial';
    fetch(fullUrl , {
        method: 'GET',
        credentials: 'omit',
        redirect:'follow'
    })
    .then(response => response.json())
    .then(data => forecastData(data))
}
