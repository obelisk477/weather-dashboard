var searchForm = document.getElementsByTagName('form')[0]
var cityName = document.getElementById('cityName')
var searchCity
var localStorageLog
let history = null

// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=7f1e5ad6955a95bd1c55da5061778aa8


// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=7f1e5ad6955a95bd1c55da5061778aa8

console.log(dayjs().format('M/D/YYYY'))

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
        useLatLongResponse(data[0].lat,data[0].lon,data[0].name)
    })
}

var useLatLongResponse = function(lat,long,weatherName) {
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
        let currentTemp = document.getElementById('currentTemp')
        let currentWindSpeed = document.getElementById('currentWindSpeed')
        let currentHumidity = document.getElementById('currentHumidity')
        let date = dayjs().format('M/D/YYYY')

        cityName.innerText = weatherName + ' (' + date + ')'
        currentTemp.innerText = 'Temp: ' + Number(Number(Number(data.main.temp)-273.15)*1.8 + 32).toFixed(2)
        currentWindSpeed.innerText = 'Wind: ' + data.wind.speed + ' MPH'
        currentHumidity.innerText = 'Humidity: ' + data.main.humidity + '%'

        let memoryObj = {lat: lat, long: long}
        localStorageLog[weatherName] = memoryObj
        localStorage.setItem('weather-dashboard-data', JSON.stringify(localStorageLog))

        let forecastAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+long+'&appid=7f1e5ad6955a95bd1c55da5061778aa8'

        fetch(forecastAPI)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                alert(response.statusText)
                return
            }
        })
        .then((moreData) => {
            let forecastCards = document.querySelector('.forecast').querySelectorAll('.card')
            
            let tomorrow = Number(dayjs().$D) + 1
            let index

            for (let i=0; i<9; i++) {
                if (dayjs.unix(moreData.list[i].dt).$D === tomorrow && dayjs.unix(moreData.list[i].dt).$H > 9) {
                    index = i
                    break
                }
            }
            for (let i=index; i<=(index+32); i+=8) {
                let thisCard = forecastCards[(i-index)/8]
                let thisCardTitle = thisCard.querySelector('.card-title')
                let thisCardTemp= thisCard.querySelector('.card-temp')
                let thisCardWind= thisCard.querySelector('.card-wind')
                let thisCardHumid = thisCard.querySelector('.card-humid')

                let date = dayjs.unix(moreData.list[i].dt).format('M/D/YYYY')
                thisCardTitle.innerText = date
                thisCardTemp.innerText = 'Temp: ' + Number(Number(Number((moreData.list[i].main.temp_max-273.15))*1.8) + 32).toFixed(2)
                thisCardWind.innerText = 'Wind: ' + moreData.list[i].wind.speed + ' MPH'
                thisCardHumid.innerText = 'Humidity: ' + moreData.list[i].main.humidity + '%'
            }
        })
        handleLocalStorageRead()
    })    
}

var handleLocalStorageRead = function() {

    if (history) {
        history.forEach(elem => {
            elem.remove()
        })
    }

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
        newBtn.classList.add('btn','btn-secondary', 'my-2', 'col-12')
        newBtn.setAttribute('type','button')
        newBtn.innerHTML = city
        buttonHistory.appendChild(newBtn)
    })

    history = document.querySelectorAll("#history > button")
}


searchForm.addEventListener('submit', handleSubmit)
document.addEventListener('DOMContentLoaded', handleLocalStorageRead)