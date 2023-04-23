var searchForm = document.getElementsByTagName('form')[0]

var handleSubmit = function(event) {
    event.preventDefault()
    var formInputField = document.querySelector('.form-group input')
    var searchCity = formInputField.value
    console.log(searchCity)
    
}

searchForm.addEventListener('submit', handleSubmit)