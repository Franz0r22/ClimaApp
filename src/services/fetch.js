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

const forecastCall = async (lat, lon, setDailyTemperatures) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Error en la respuesta");
    }

    const data = await response.json();

    // Crear un objeto para almacenar las temperaturas máximas y mínimas por día
    const dailyTemperatures = {};

    // Procesar los datos para encontrar las temperaturas máximas y mínimas para cada día
    data.list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0]; // Obtener la fecha del formato 'YYYY-MM-DD'
      const temp = item.main.temp;
      const weather = item.weather[0].description;

      if (!dailyTemperatures[date]) {
        dailyTemperatures[date] = { max: temp, min: temp };
      } else {
        dailyTemperatures[date].max = Math.max(dailyTemperatures[date].max, temp);
        dailyTemperatures[date].min = Math.min(dailyTemperatures[date].min, temp);
        dailyTemperatures[date].weather = weather;
      }
    });


    setDailyTemperatures(dailyTemperatures);

  } catch (error) {
    console.error("Hubo un error con la llamada:", error);
  }
};




export { locationCall, apiCall, forecastCall };
