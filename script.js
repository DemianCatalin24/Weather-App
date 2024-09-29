const textInput = document.querySelector(".textInput");
// const searchBtn = document.querySelector(".searchBtn");
const locationBtn = document.querySelector(".locationBtn");
const infoContainer = document.querySelector(".infoContainer");
const weatherForm = document.querySelector(".weatherForm");
const apiKey = "ede89b36f71bcf657292936b3d46ec30";
const forecastContainer = document.querySelector(".forecastContainer");
const select = document.querySelector(".hours");
const selector = document.querySelector(".selector");

weatherForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = textInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
      forecast(city);
      textInput.value = "";
      selector.style.display = "flex";
    } catch (err) {
      console.error(err);
      displayError(err.message);
    }
  } else {
    displayError("Please enter a valid city name");
  }
});

async function getWeatherData(city) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(weatherUrl);

  if (!response.ok) {
    throw new Error("City is not valid");
  }
  return response.json();
}

async function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity, temp_max, temp_min },
    weather: [{ description, id, icon }],
    wind: { speed },
  } = data;
  console.log(data);
  const html = `<h1 class="cityName">${city}</h1>
   <img class="weatherIcon" src="${getWeatherImg(id)}"></img>
  <div class="temp">${Math.round(temp)}°C</div>
  <div class="humidity">Humidity: ${humidity}%</div>
  <div class="description">Wind Speed:${speed.toFixed(1)}km/h</div>
  <div class="description">${description}</div>
  <div class="temp-min">Min: ${temp_min.toFixed(1)}°C</div>
  <div class="temp-max">Max: ${temp_max.toFixed(1)}°C</div>`;
  infoContainer.style.display = "flex";
  infoContainer.textContent = "";

  infoContainer.insertAdjacentHTML("beforeend", html);
}
function getWeatherImg(wheatherId) {
  switch (true) {
    case wheatherId >= 200 && wheatherId < 300:
      return "images/scattered-thunderstorms.png";
    case wheatherId >= 300 && wheatherId < 400:
      return "images/drizzle.png";
    case wheatherId >= 500 && wheatherId < 600:
      return "images/rain.png";
    case wheatherId >= 600 && wheatherId < 700:
      return "images/snow.png";
    case wheatherId >= 700 && wheatherId < 800:
      return "images/mist.png";
    case wheatherId > 800 && wheatherId < 810:
      return "images/clouds.png";
    case wheatherId === 800:
      return "images/clear.png";
    default:
      return "images/clear.png";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("div");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  infoContainer.textContent = "";
  selector.style.display = "none";
  infoContainer.appendChild(errorDisplay);
  infoContainer.style.display = "flex";
}

const createForecastCard = (data, formattedDate) => {
  return `
  <li class="card">
  <div class="date">${formattedDate}</div>
   <img class="weatherIconFore" src="${getWeatherImg(
     data.weather[0].id
   )}"></img>
 <div class="tempFore">${Math.round(data.main.temp)}°C</div>
 <div class="descriptionFore">${data.weather[0].description}</div>
 
 </li>
 `;
};

// async function forecast(city) {
//   const resFore = await fetch(
//     `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&q=${city}`
//   );
//   if (!resFore.ok) {
//     throw new Error("City is not valid");
//   }
//   console.log(resFore);
//   const dataForecast = await resFore.json();
//   console.log(dataForecast.city.name);
//   const uniqDays = [];

//   const fiveDays = dataForecast.list.filter((forecast) => {
//     const forecastDate = new Date(forecast.dt_txt);
//     const forecastHours = forecastDate.getHours();
//     // select.addEventListener("change", function (e) {
//     //   const forecastHours = e.target.value;
//     // });

//     if (!uniqDays.includes(forecastDate)) {
//       uniqDays.push(forecastDate.getDate());
//     }
//     return (
//       forecastDate.getDate() === uniqDays[uniqDays.length - 1] &&
//       forecastHours === 15
//     );
//   });
//   forecastContainer.style.display = "flex";
//   forecastContainer.textContent = "";

//   console.log(fiveDays);

//   fiveDays.forEach((data) => {
//     const {
//       main: { temp },
//       weather: [{ description, id }],
//       wind: { speed },
//     } = data;

//     forecastContainer.insertAdjacentHTML("beforeend", createForecastCard(data));
//   });
// }

// console.log(select.target.value);
// forecast("London");

// `https://api.openweathermap.org/data/2.5/forecast?q=München,DE&appid={ecc9f1e74bf84bba3a50aa7d35969331}`

async function forecast(city) {
  const resFore = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&q=${city}`
  );
  if (!resFore.ok) {
    throw new Error("City is not valid");
  }
  console.log(resFore);
  const dataForecast = await resFore.json();
  console.log(dataForecast.city.name);
  const uniqDays = [];

  select.addEventListener("change", function (event) {
    const forecastHour = Number(event.target.value);

    const fiveDays = dataForecast.list.filter((forecast) => {
      const forecastDate = new Date(forecast.dt_txt);
      const forecastHours = forecastDate.getHours();

      if (!uniqDays.includes(forecastDate)) {
        uniqDays.push(forecastDate.getDate());
      }
      return (
        forecastDate.getDate() === uniqDays[uniqDays.length - 1] &&
        forecastHours === forecastHour
      );
    });

    forecastContainer.style.display = "flex";
    forecastContainer.textContent = "";

    console.log(fiveDays);

    fiveDays.forEach((data) => {
      const forecastDate = new Date(data.dt_txt);
      const formattedDate = new Intl.DateTimeFormat("en-GB").format(
        forecastDate
      );
      const {
        main: { temp },
        weather: [{ description, id }],
        wind: { speed },
      } = data;

      forecastContainer.insertAdjacentHTML(
        "beforeend",
        createForecastCard(data, formattedDate)
      );
    });
  });

  // Initial call to the forecast function with default forecast hour (15:00)
  select.value = "15";
  select.dispatchEvent(new Event("change"));
}

// async function getCurrentPosition() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(async function (position) {
//       const { latitude } = position.coords;
//       const { longitude } = position.coords;
//       console.log(latitude, longitude);
//       const geoApi = await fetch(
//         `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
//       );

//       const geoData = await geoApi.json();
//       console.log(geoData[0].name);
//       const cityGeo = await getWeatherData(geoData[0].name);
//       displayWeatherInfo(cityGeo);

//       selector.style.display = "flex";
//       forecast(geoData[0].name);
//     });
//   }
// }

// getCurrentPosition();

async function getWeatherDataFromCoords(latitude, longitude) {
  const geoApi = await fetch(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
  );
  const geoData = await geoApi.json();
  const city = geoData[0].name;
  return getWeatherData(city);
}

// locationBtn.addEventListener("click", async (e) => {
//   e.preventDefault();
//   try {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async function (position) {
//         const { latitude, longitude } = position.coords;
//         const weatherData = await getWeatherDataFromCoords(latitude, longitude);
//         displayWeatherInfo(weatherData);
//         selector.style.display = "flex";
//         forecast(weatherData.name);
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     displayError(err.message);
//   }
// });

// async function getCurrentPosition() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(async function (position) {
//       const { latitude, longitude } = position.coords;
//       const weatherData = await getWeatherDataFromCoords(latitude, longitude);
//     });
//   }
// }

// getCurrentPosition();

// displayWeatherInfo(weatherData);
//   selector.style.display = "flex";
//   console.log(weatherData.name);
//   forecast(weatherData.name);

async function getCurrentPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const { latitude, longitude } = position.coords;
        const weatherData = await getWeatherDataFromCoords(latitude, longitude);
        displayWeatherInfo(weatherData);
        selector.style.display = "flex";
        forecast(weatherData.name);
      },
      function (error) {
        displayError(`${error.message} please allow acces to your location `);
        console.error("Geolocation error:", error);
      }
    );
  } else {
    displayError("Geolocation is not supported by this browser.");
    console.error("Geolocation is not supported by this browser.");
  }
}

locationBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  getCurrentPosition();
});
