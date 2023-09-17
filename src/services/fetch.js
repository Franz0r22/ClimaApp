const apikey = "e16fd543e91da27dcdfbdf131b88716d";

const locationCall = async (city, latState, lonState) => {
  
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apikey}`
    );

    if (!response.ok) {
      throw new Error("Error en la respuesta");
    }

    const data = await response.json();

    const [location] = data;

    const latitude = location.lat;
    const longitude = location.lon;

    latState(latitude);
    lonState(longitude);


  } 
  
  catch (error) {
    
    console.error("Hubo un error con la llamada:", error);
  
  }
};

const apiCall = async (lat, lon, temperature, weather, location, wind, direction, visibility) => {

  try {
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`   
    );

    if (!response.ok) {
      throw new Error("Error en la respuesta");
    }

    const data = await response.json();

    const temperatureValues = data.main;

    const [weatherValue] = data.weather;

    const locationValue = data.name;

    const windValue = data.wind;

    const windDirection = data.wind.deg;

    const visibilityValue = data.visibility;

    temperature(temperatureValues);

    weather(weatherValue);

    location(locationValue);

    wind(windValue);

    direction(windDirection);

    visibility(visibilityValue);
  
  } 
  
  catch (error) {
    
    console.error("Hubo un error con la llamada:", error);
  
  }
};

export { locationCall, apiCall };
