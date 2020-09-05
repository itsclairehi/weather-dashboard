



var getUserCity = function(cityName){
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=897fdf59a77382fd898e2fef5873008f
    `
fetch(apiUrl)
.then(function(response) {

    console.log(response);
    // console.log(response.json());
    return response.json();
})
.then(function(response){
    console.log(response)
    $("#main-weather").text(response.weather[0].main)
    
})
}


//button click
$("#searchBtn").on("click", function(){
    event.preventDefault()
    var cityName= $("#username").val()
    console.log(cityName);

    getUserCity(cityName)
})


//send coordinates to onecall to get all info
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&
// exclude={part}&appid={YOUR API KEY}