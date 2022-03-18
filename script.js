let searchButton = document.querySelector(".busca");
let searchInput = document.querySelector("#searchInput");
let resultField = document.querySelector(".resultado");

searchButton.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    let location = searchInput.value;
    if (location !== "") {
        clearInfo();
        showWarning("Carregando...");

        let url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURI(
            location
        )}&limit=1&appid=285595b2ceecb81516599c40d2267572`;

        let result = await fetch(url);
        let json = await result.json();
        if (json.length !== 0) {
            let arrayLatLon = [json[0]["lat"], json[0]["lon"]];

            let newUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${arrayLatLon[0]}&lon=${arrayLatLon[1]}&appid=285595b2ceecb81516599c40d2267572&units=metric&lang=pt_br`;

            let newResult = await fetch(newUrl);
            let newJson = await newResult.json();
            console.log(newJson);
            if (newJson.cod === 200) {
                showInfo({
                    name: newJson.name,
                    country: newJson.sys.country,
                    temp: newJson.main.temp,
                    tempIcon: newJson.weather[0].icon,
                    windSpeed: newJson.wind.speed,
                    windAngle: newJson.wind.deg,
                });
            }
        } else {
            clearInfo();
            showWarning("Localização não encontrada.");
        }
    } else {
        clearInfo();
    }
});

// async function getCoordinates(_location) {
//     return await fetch(
//         `https://api.openweathermap.org/geo/1.0/direct?q=${_location}&limit=1&appid=285595b2ceecb81516599c40d2267572`
//     )
//         .then((response) => response.json())
//         .then((data) => {
//             let arrayLatLong = [data[0]["lat"], data[0]["lon"]];
//             getWeatherData(arrayLatLong[0], arrayLatLong[1]);
//         });
// }

// async function getWeatherData(lat, lon) {
//     await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=285595b2ceecb81516599c40d2267572&units=metric&lang=pt_br`
//     )
//         .then((response) => response.json())
//         .then((data) => {
//             showResults(data);
//         });
// }

function showInfo(json) {
    showWarning("");
    resultField.querySelector(
        ".titulo"
    ).innerHTML = `${json.name}, ${json.country}`;
    resultField.querySelector(
        ".info .temp .tempInfo"
    ).innerHTML = `${json.temp} <sup>ºC</sup>`;
    resultField.querySelector(
        ".ventoInfo"
    ).innerHTML = `${json.windSpeed} <span>km/h</span>`;
    resultField
        .querySelector(".temp img")
        .setAttribute(
            "src",
            `http://openweathermap.org/img/wn/${json.tempIcon}@2x.png`
        );
    resultField.querySelector(".ventoPonto").style.transform = `rotate(${
        json.windAngle - 90
    }deg)`;
    resultField.style.display = "block";
}

function clearInfo() {
    showWarning("");
    resultField.style.display = "none";
}

function showWarning(msg) {
    document.querySelector(".aviso").innerHTML = msg;
}
