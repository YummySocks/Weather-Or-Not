var ApiKey = '8fceceef7f0be4b04dce5313fe7967a1';

$('#searchButton').on("click",function(){
    var textInput = $('#searchText').val();
    city = textInput;
    checkForecast();
})



function pullWeatherData(d){
    var fahrenheit = Math.round(((parseFloat(d.main.temp)-273.15)*1.8)+32);
    console.log(fahrenheit);
}

function forecastData(f){
    console.log(f.list[6].dt_txt);
}





city = 'Atlanta';
function checkCurrentWeather(){
    var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+ApiKey;
    fetch(currentUrl , {
        method: 'GET',
        credentials: 'omit',
        redirect: 'follow'
    })
    .then(response => response.json())
    .then(data => pullWeatherData(data));
}

function checkForecast(){
    var foreUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid='+ApiKey;
    fetch(foreUrl , {
        method: 'GET',
        credentials: 'omit',
        redirect:'follow'
    })
    .then(response => response.json())
    .then(data => forecastData(data))
}
