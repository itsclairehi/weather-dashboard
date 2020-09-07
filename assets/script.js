var apiKey = "897fdf59a77382fd898e2fef5873008f"

var getUvIndex = function (data) {
    var lat = data.city.coord.lat
    var lon = data.city.coord.lon

    var apiUrl = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            var uvIndexNum = data.value
            var uvIndex = $("<p>").text("UV index: " + data.value)
            uvIndex.css("width", "fit-content")
            
            //uv color indication
            if (uvIndexNum <= 2) {
                uvIndex.css("background-color", "lightgreen")
            } else if (uvIndexNum <= 5) {
                uvIndex.css("background-color", "yellow")
            } else if (uvIndexNum <= 7) {
                uvIndex.css("background-color", "orange")
            } else if (uvIndexNum <= 10) {
                uvIndex.css("background-color", "red")
                uvIndex.css("color", "white")
            } else {
                uvIndex.css("background-color", "purple")
                uvIndex.css("color", "white")
            }
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
            var arr = data.list;
            var filteredArr = arr.filter(function (i) {
                var time = i.dt_txt;
                //find the index of the character in the string
                if (time.indexOf("15:00:00") != -1) {
                    return i;
                }

            })

            $("#forecast").empty()

            //loop thru array and make element, append
            for (i = 0; i < filteredArr.length; i++) {
                var dayDiv = $("<div>").addClass("card day")

                //get just date from data WORK ON THIS
                var dateTime = filteredArr[i].dt_txt.split(" ")
                var justDate = dateTime[0]
                var date = $("<p>").text(justDate)

                var temp = $("<p>").text("Temp: " + filteredArr[i].main.temp + " F")
                var humidity = $("<p>").text("Humidity: " + filteredArr[i].main.humidity + "%")
                var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + filteredArr[i].weather[0].icon + "@2x.png")

                dayDiv.append(date, icon, temp, humidity)
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

            if (response.ok & historyArr.indexOf(cityName) === -1) {
                var newCity = $("<button>").text(cityName).addClass("col-12 btn")
                $("#cities-history").append(newCity)

                historyArr.push(cityName)

                $("#forecast-title").append($("<p>").text("5-day forecast"))
                localStorage.setItem('history', JSON.stringify(historyArr))

            } else {
                $("#forecast").empty()
                $("#forecast-title").empty()
            }

            if (!response.ok) {
                alert("Not a valid city")
            }

            return response.json();
        })
        .then(function (data) {

            $("#current-city").empty()
            var name = $("<h2>").text(data.name);
            var temp = $("<p>").text("Current Temperature: " + data.main.temp + " F");
            var humidity = $("<p>").text("Humidity: " + data.main.humidity + "%")
            var windSpeed = $("<p>").text("Wind speed: " + data.wind.speed + " mph")

            $("#current-city").append(name, temp, humidity, windSpeed);

            getForecast(data.name)
        })
}


//search button click
$("#searchBtn").on("click", function () {
    event.preventDefault()
    var cityName = $("#username").val()

    $("#forecast-title").empty()
    $("#forecast-title").append($("<p>").text("5-day forecast"))

    getUserCity(cityName)

})

//load local storage for city history
var historyArr = JSON.parse(localStorage.getItem('history')) || []

//make buttons out of city history
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
    // $("#forecast-title").empty()
    $("#forecast-title").append($("<p>").text("5-day forecast"))
})

//history clear button
$("#clear-btn").on("click", function () {
    localStorage.clear()
    $("#cities-history").empty()
})

renderHistory()