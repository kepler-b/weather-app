import { createContext, useContext } from "react";

async function getLocationData() {
  let location = { lat: 20.5937, long: 78.9629 };
  try {
    location = await (new Promise((resolve, reject) => {
      let loc = {};
      navigator.geolocation.getCurrentPosition((position) => {
        loc.lat = position.coords.latitude;
        loc.long = position.coords.longitude;
        resolve(loc);
      }, (error) => {
        alert(error.message);
        reject(error);
      });
    }));
  } catch (error) {
    console.log(error)
    return { lat: 20.5937, long: 78.9629 };
  }
  return location;
}

export async function getWeatherData(units = "F") {
  let {lat, long} = await getLocationData();
  const API_KEY = "75db0c8c95dc5b65b17d102e9ba83b23";
  const weatherDataAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`;

  const result = await fetch(weatherDataAPIURL).catch((error) => console.log(error.message));
  if (!result) return;
  const weatherData = await result.json();
  window.weatherData = weatherData;
  return weatherData;
}

export async function getFiveDayWeatherData({ lat, long }) {
  const locationAPIUrl = `https://www.openstreetmap.org/#map=18/${lat}/${long}`;
  const result = await fetch(locationAPIUrl,  {
    mode: "no-cors"
  }).catch((error) => console.log(error.message));
  if (!result) return;
  window.result = result;
  const locationData = await result.text();
  return locationData;
}

const WeatherContext = createContext({ degreeType: "F" })


export function useWeatherAPIContext() {
  return useContext(WeatherContext);
}

export { WeatherContext };