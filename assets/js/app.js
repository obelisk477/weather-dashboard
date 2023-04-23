var searchForm = document.getElementsByTagName('form')[0]
var cityName = document.getElementById('cityName')
var searchCity
var localStorageLog

// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=7f1e5ad6955a95bd1c55da5061778aa8


// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=7f1e5ad6955a95bd1c55da5061778aa8



var handleSubmit = function(event) {
    event.preventDefault()
    var formInputField = document.querySelector('.form-group input')
    searchCity = formInputField.value

    fetch('http://api.openweathermap.org/geo/1.0/direct?q='+ searchCity +'&limit=5&appid=7f1e5ad6955a95bd1c55da5061778aa8')
    .then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            alert(response.statusText)
            return
        }
    })
    .then((data) => {
        useLatLongResponse(data[0].lat,data[0].lon)
    })
}

var useLatLongResponse = function(lat,long) {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&appid=7f1e5ad6955a95bd1c55da5061778aa8')
    .then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            alert(response.statusText)
            return
        }
    })
    .then((data) => {
        console.log(data)
        let currentTemp = document.getElementById('currentTemp')
        let currentWindSpeed = document.getElementById('currentWindSpeed')
        let currentHumidity = document.getElementById('currentHumidity')

        cityName.innerText = searchCity
        currentTemp.innerText = 'Temp: ' + Number(Number(Number(data.main.temp)-273.15)*1.8 + 32).toFixed(2)
        currentWindSpeed.innerText = 'Wind: ' + data.wind.speed + ' MPH'
        currentHumidity.innerText = 'Humidity: ' + data.main.humidity + '%'

        let memoryObj = {lat: lat, long: long}
        localStorageLog[searchCity] = memoryObj
        localStorage.setItem('weather-dashboard-data', JSON.stringify(localStorageLog))
    })    
}

var handleLocalStorageRead = function() {
    localStorageLog = localStorage.getItem('weather-dashboard-data')
    let obj = {}
    if (!localStorageLog) {
        localStorage.setItem('weather-dashboard-data', JSON.stringify(obj))
    }

    localStorageLog = JSON.parse(localStorage.getItem('weather-dashboard-data'))
    let pastCities = Object.keys(localStorageLog)
    let buttonHistory = document.getElementById("history")
    pastCities.forEach(city => {
        let newBtn = document.createElement('button')
        newBtn.classList.add('btn','btn-primary', 'my-4', 'col-12')
        newBtn.setAttribute('type','button')
        newBtn.innerHTML = city
        buttonHistory.appendChild(newBtn)
        console.log("hello")
    })
}


searchForm.addEventListener('submit', handleSubmit)
document.addEventListener('DOMContentLoaded', handleLocalStorageRead)