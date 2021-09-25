var ApiKey = '8fceceef7f0be4b04dce5313fe7967a1';

$('#searchButton').on("click",function(){
    var textInput = $('#searchText').val();
    city = textInput;
    grabWeatherData();
})


//pulls out the lat and lon data to pass on to the real weather call
function pullWeatherData(d){
    var lat = d.coord.lat;
    var lon = d.coord.lon;
    fullWeatherData(lat,lon);
}
//used for getting the data for todays weather and the next 5 days
function forecastData(f){
    console.log(f);
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
