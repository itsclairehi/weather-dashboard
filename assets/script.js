var apiKey = "897fdf59a77382fd898e2fef5873008f"

var getUvIndex = function (data) {
    var lat = data.city.coord.lat
    var lon = data.city.coord.lon

    var apiUrl = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiUrl)
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (data) {
            var uvIndex = $("<p>").text("UV index: " + data.value)
            $("#current-city").append(uvIndex)
        })
}

var getForecast = function (cityName) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`
    fetch(apiUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log('forecast', data.list)
            var arr = data.list;
            var filteredArr = arr.filter(function (i) {
                var time = i.dt_txt;
                //find the index of the character in the string
                if (time.indexOf("15:00:00") != -1) {
                    return i;
                }

            })
            console.log('new arr', filteredArr)

            $("#forecast").empty()

            //loop thru array and make element, append
            for (i = 0; i < filteredArr.length; i++) {
                var dayDiv = $("<div>").addClass("card day")

                //get just date from data WORK ON THIS
                var dateTime = filteredArr[i].dt_txt.split(" ")
                var justDate = dateTime[0]
                var date = $("<p>").text(justDate)

                // var icon = filteredArr[i].weather.icon
                var temp = $("<p>").text("Temp: " + filteredArr[i].main.temp + " F")
                var humidity = $("<p>").text("Humidity: " + filteredArr[i].main.humidity + "%")


                dayDiv.append(date, temp, humidity)
                $("#forecast").append(dayDiv)

            }

            //call get uv index function
            getUvIndex(data)
        })
}

var getUserCity = function (cityName) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok & historyArr.length < 11) {
                var newCity = $("<button>").text(cityName).addClass("col-12 btn")
                $("#cities-history").append(newCity)
            }

            return response.json();
        })
        .then(function (data) {
            console.log("Current weather", data)
            $("#current-city").empty()
            var name = $("<h2>").text(data.name);
            var temp = $("<p>").text("Current Temperature: " + data.main.temp + " F");
            var humidity = $("<p>").text("Humidity: " + data.main.humidity + "%")
            var windSpeed = $("<p>").text("Wind speed: " + data.wind.speed + " mph")

            $("#current-city").append(name, temp, humidity, windSpeed);

            getForecast(data.name)
        })
}


//button click
$("#searchBtn").on("click", function () {
    event.preventDefault()
    var cityName = $("#username").val()

    if (historyArr.indexOf(cityName) === -1) {
        historyArr.push(cityName)
        console.log(historyArr);

        localStorage.setItem('history', JSON.stringify(historyArr))
    }

    getUserCity(cityName)

})


var historyArr = JSON.parse(localStorage.getItem('history')) || []
console.log("historyArr " + historyArr);

var renderHistory = function () {
    for (i = 0; i < historyArr.length; i++) {
        var pastCity = historyArr[i]
        var pastCityEl = $("<button>").text(pastCity).addClass("col-12 btn")

        $("#cities-history").append(pastCityEl)
    }
}


//make history clickable
$("#cities-history").on("click", "button", function () {
    var cityFromHistory = $(this).text()
    getUserCity(cityFromHistory)
})

//history clear button
$("#clear-btn").on("click", function () {
    localStorage.clear()
    $("#cities-history").empty()
})

renderHistory()


