const API = "2191eabed224a1886878ac5a7e7ef029";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];




const day = new Date();
const dayname = days[day.getDay()];
console.log(dayname);
dayEl.textContent = dayname;



let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
console.log(month);
dateEl.textContent = date + " " + month + " " + year;

// add event
btnEl.addEventListener("click", (e) => {
    e.preventDefault();
    // check empty value
    if (inputEl.value !== "") {
        const Search = inputEl.value;
        inputEl.value = "";
        findLocation(Search);
    } else {
        console.log("Please Enter City or Country Name");
    }
});



async function findLocation(name) {
    iconsContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    listContentEl.innerHTML = "";
    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
        const data = await fetch(API_URL);
        const result = await data.json();
        console.log(result);

        if (result.cod !== "404") {

            // display image content
            const ImageContent = displayImageContent(result);
            // display right side content
            const rightSide = rightSideContent(result);
            // forecast function
            displayForeCast(result.coord.lat, result.coord.lon);
            
            const bgimage =  changebackground(result);

            setTimeout(() => {
                iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
                iconsContainer.classList.add("fadeIn");
                dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
                document. body. style. backgroundImage=`url(./stock/${result.weather[0].main}.jpg)`

            }, 1500);
        } else {
            const message = `<h2 class="weather_temp">${result.cod}</h2>
        <h3 class="cloudtxt">${result.message}</h3>`;
            iconsContainer.insertAdjacentHTML("afterbegin", message);
        }
    } catch (error) {
        console.log("bhai error hai kahin")
    }
}

function displayImageContent(data) {
    return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon
        }@4x.png" alt="" />
      <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}°C</h2>
      <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

function rightSideContent(result) {
    return `<div class="content">
                <p class="title">NAME</p>
                <span class="value">${result.name}</span>
              </div>
              <div class="content">
                <p class="title">TEMP</p>
                <span class="value">${Math.round(result.main.temp - 275.13).toFixed(2)}°C</span>
              </div>
              <div class="content">
                <p class="title">HUMIDITY</p>
                <span class="value">${result.main.humidity}%</span>
              </div>
              <div class="content">
                <p class="title">WIND SPEED</p>
                <span class="value">${result.wind.speed} Km/h</span>
              </div>
            </div>`;

}

async function displayForeCast(lat, lon) {
    console.log("cfgvhj")
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}`;
    const data = await fetch(ForeCast_API);
    const result = await data.json();
    console.log(result);

    const uniqeForeCastDays = [];
    console.log("qwerty");
    // console.log(result.list[3]);
    // console.log(result.list[4]);

    const daysForecast = result.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqeForeCastDays.includes(forecastDate)) {
            return uniqeForeCastDays.push(forecastDate);
        }
    });
    // console.log(daysForecast);
    daysForecast.forEach((content, index) => {
        console.log(content);
        if (index <= 3) {
            console.log(daysForecast);
            listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
        }
    });

}


// forecast html element data
function forecast(frContent) {
    const day = new Date(frContent.dt_txt);
    const dayName = days[day.getDay()];
    const splitDay = dayName.split("", 3);
    const joinDay = splitDay.join("");

    // console.log(dayName);

    return `<li>
    <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon
        }@2x.png" />
    <span>${joinDay}</span>
    <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
  </li>`;
}

function changebackground(result){
    return `<body style="background-image: url('./stock/${result.weather[0].main}.jpg'); background-size: 100%; background-position: cover
;">`
}



