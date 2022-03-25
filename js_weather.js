let lat = '43.238949'
let lon = '76.889709'
let api_key = '3a0deba573626eb89cafac3b33d6d0cd'
let base_url = `https://api.openweathermap.org/data/2.5/onecall`


async function makeRequest(url, method = 'GET') {
    let response = await fetch(url, {method});

    if (response.ok) {
        return await response.json();
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function parseDate(date) {
    let result = new Date(date * 1000);
    return result.toLocaleDateString();
}

async function onClick(event) {
    let url = `${base_url}?lat=${lat}&lon=${lon}&lang=ru&units=metric&exclude=hourly,minutely&appid=${api_key}`

    try {
        let {current, daily} = await makeRequest(url);
        $('.current_day').append(
            `<b>${parseDate(current.dt)}</b>`
        )
        $('.today').append(
            `<div class="col card text-dark bg-success bg-gradient mb-4" style="width: 400px;">
             <h5>Сейчас</h5>
             <p>Текущая дата: ${parseDate(current.dt)}</p>
             <p>Температура: ${current.temp} °C</p>
             <p>Чувствуется как: ${current.feels_like} °C</p>
             <p>Давление: ${current.pressure} гПа</p>
             <p>Влажность: ${current.humidity} %</p>
             <p>Cкорость ветра: ${current.wind_speed} м/с</p></div>`
        )
        for (current_w of current.weather) {
            $('.text-dark').append(
                `<p>${current_w.description}</p>
                <img src="http://openweathermap.org/img/wn/${current_w.icon}@2x.png" style="width: 100px">`
            )
        }
        daily.forEach(function (value, num) {
            if (num === 0) {
                $('.today').append(
                    `<div class="col card text-dark bg-danger bg-gradient mb-4" style="width: 400px;">
                    <h5>Погода на день</h5>
                    <p>Температура: ${value.temp.day} °C</p>
                    <p>Влажность: ${value.humidity} %</p>
                    <p>Cкорость ветра: ${value.wind_speed} м/с</p>
                    <p>${value.weather[0].description}</p>
                    <img src="http://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png" style="width: 100px">
                    </div>`
                )
                return
            }
            $('.daily').append(
                `<div class="col card text-dark bg-danger bg-gradient mb-4" style="max-width: 18rem;"><p>Дата: ${parseDate(value.dt)}</p>
             <p>Температура: ${value.temp.day} °C</p>
             <p>Влажность: ${value.humidity} %</p>
             <p>Cкорость ветра: ${value.wind_speed} м/с</p>
             <p>${value.weather[0].description}</p>
             <img src="http://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png" style="width: 100px">
             </div>`
            )
        })

    } catch (error) {
        console.log(error);
    }
}

window.addEventListener("load", function () {
    onClick()
});