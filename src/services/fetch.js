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

const apiCall = async (lat, lon, temperature, weather, location) => {

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

    temperature(temperatureValues);

    weather(weatherValue);

    location(locationValue);
  
  } 
  
  catch (error) {
    
    console.error("Hubo un error con la llamada:", error);
  
  }
};

export { locationCall, apiCall };
