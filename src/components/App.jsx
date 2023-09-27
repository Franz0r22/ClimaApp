import { useState, useEffect, useRef } from "react";
import { locationCall, apiCall, forecastCall } from "../services/fetch";
import "../App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function App() {
  //Estados
  const [city, setCity] = useState();
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [temperature, setTemperature] = useState();
  const [weather, setWeather] = useState();
  const [location, setLocation] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [wind, setWind] = useState();
  const [windDegrees, setWindDegrees] = useState();
  const [visibility, setVisibility] = useState();
  const [dailyForecast, setDailyForecast] = useState();

  //referencias
  const cityRef = useRef();

  //Efecto obtener lat y lon API
  useEffect(() => {
    if (city != undefined) {
      locationCall(city, setLat, setLon);
    }
  }, [city]);

  //Efecto obtener datos del clima API
  useEffect(() => {
    if (lat !== undefined && lon !== undefined) {
      apiCall(
        lat,
        lon,
        setTemperature,
        setWeather,
        setLocation,
        setWind,
        setWindDegrees,
        setVisibility
      );
    }
  }, [lat, lon]);

  //Efecto ubicación actual por default
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLon(longitude);
      });
    } else {
      console.error("La geolocalización no está disponible en este navegador.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  //Efecto obtener pronóstico del clima
  useEffect(() => {
    if (lat !== undefined && lon !== undefined) {
      forecastCall(lat, lon, setDailyForecast);
    }
  }, [lat, lon]);

  //Eventos
  const handleClickSearch = () => {
    setCity(cityRef.current.value);
    cityRef.current.value = "";
    setMenuOpen(!menuOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickResetLocation = () => {
    getCurrentLocation();
  };

  const handleClickNYLocation = () => {
    setLat(40.73061);
    setLon(-73.935242);
    setMenuOpen(!menuOpen);
  };

  const handleClickLondonLocation = () => {
    setLat(51.509865);
    setLon(-0.118092);
    setMenuOpen(!menuOpen);
  };

  const handleClickMadridLocation = () => {
    setLat(40.416775);
    setLon(-3.703790);
    setMenuOpen(!menuOpen);
  };

  //Round
  const roundValue = (value) => {
    return Math.round(value);
  };

  //Convertir Mts/s a Km/h
  const convertToKmxH = (value) => {
    return roundValue(value * 3.6);
  };

  //Convertir Mts a Kms
  const convertToKm = (value) => {
    return roundValue(value / 1000);
  };

  //Dirección del viento
  const windDirection = (windDegrees) => {
    // Direcciones cardinales en orden
    const cardinalDirections = [
      "North",
      "North-Northeast",
      "Northeast",
      "East-Northeast",
      "East",
      "East-Southeast",
      "Southeast",
      "South-Southeast",
      "South",
      "South-Southwest",
      "Southwest",
      "West-Southwest",
      "West",
      "West-Northwest",
      "Northwest",
      "North-Northwest",
      "North",
    ];

    // Calcular el índice en el arreglo usando los grados
    const index = Math.round((windDegrees % 360) / 22.5);

    // Asegurarse de que el índice esté dentro del rango del arreglo
    const directionIndex =
      index >= 0 && index < cardinalDirections.length ? index : 0;

    // Devolver la dirección cardinal correspondiente
    return cardinalDirections[directionIndex];
  };

  const direction = windDirection(windDegrees);

  //Fecha
  const date = new Date();
  const today = date.getDate();
  const month = date.getMonth() + 1;

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayName = () => {
    const day = date.getDay();
    return dayNames[day];
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = (month) => {
    return monthNames[month - 1];
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={5} lg={4} xl={3} className="sideBlock">
            <div className="cloudBlock"></div>
            <div className="d-flex justify-content-between align-items-center mx-4 mt-5">
              <button className="btn-places" onClick={toggleMenu}>
                Search for places
              </button>
              <div className="bgIcon">
                <span
                  className="material-symbols-outlined colorIcon"
                  onClick={handleClickResetLocation}
                >
                  my_location
                </span>
              </div>
            </div>
            {weather && (
              <div className="text-center mt-image">
                <img
                  className="imgWeather animate"
                  src={`./src/assets/${weather.description}.png`}
                  alt="Wheater Image"
                />
              </div>
            )}
            <div>
              {temperature && (
                <h2 className="temperatureTitle mt-temp">
                  {roundValue(temperature.temp)}
                  <span className="celsius">°C</span>
                </h2>
              )}
            </div>
            <div className="mt-4">
              {weather && <h2 className="weatherTitle mt-2">{weather.main}</h2>}
            </div>
            <div className="d-flex align-items-center justify-content-center mt-4">
              <span className="material-symbols-outlined locationIcon">
                location_on
              </span>
              {location && <h2 className="locationTitle mt-2">{location}</h2>}
            </div>
            <div className="locationTitle my-4">
              {dayName(today)}, {today} {monthName(month)}
            </div>
            <div className={menuOpen ? "menu-location open" : "menu-location"}>
              <div className="text-end me-4">
                <span
                  className="material-symbols-outlined closeIcon"
                  onClick={toggleMenu}
                >
                  close
                </span>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <div>
                  <input
                    className="inputSearch"
                    type="text"
                    placeholder="Search location"
                    ref={cityRef}
                  />
                </div>
                <button className="btn-search" onClick={handleClickSearch}>
                  Search
                </button>
              </div>
              <div className="mt-5">
                <div className="cities-search mx-4" onClick={handleClickNYLocation}>
                  New York
                </div>
                <div className="cities-search mx-4 mt-4" onClick={handleClickLondonLocation}>
                  London
                </div>
                <div className="cities-search mx-4 mt-4" onClick={handleClickMadridLocation}>
                  Madrid
                </div>
              </div>
            </div>
          </Col>
          <Col md={7} lg={8} xl={9} className="contentBlock">
            <Container id="containerBox">
              <Row className="g-4">
                <Col xs={12} sm={6} md={12} lg={4} xl={4} xxl>
                  <div className="card-forecast h-100">
                    <p className="forecastTitle">Tomorrow</p>
                    {dailyForecast && (
                      <div>
                        {Object.keys(dailyForecast).map((date, index) => {
                          if (index === 1) {
                            return (
                              <div key={date}>
                                <div className="text-center">
                                  <img
                                    className=""
                                    src={`./src/assets/${dailyForecast[date].weather}.png`}
                                    alt="Wheater Image"
                                    height={60}
                                  />
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                  <p className="forecastTitle mb-0">
                                    {roundValue(dailyForecast[date].max)} °C
                                  </p>
                                  <p className="forecastTitle mb-0">
                                    {roundValue(dailyForecast[date].min)} °C
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={12} sm={6} md={12} lg={4} xl={4} xxl>
                  <div className="card-forecast h-100">
                    <p className="forecastTitle">
                      {today + 2} {monthName(month)}
                    </p>
                    {dailyForecast && (
                      <div>
                        {Object.keys(dailyForecast).map((date, index) => {
                          if (index === 2) {
                            return (
                              <div key={date}>
                                <div className="text-center">
                                  <img
                                    className=""
                                    src={`./src/assets/${dailyForecast[date].weather}.png`}
                                    alt="Wheater Image"
                                    height={60}
                                  />
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                  <p className="forecastTitle mb-0">
                                    {roundValue(dailyForecast[date].max)} °C
                                  </p>
                                  <p className="forecastTitle mb-0">
                                    {roundValue(dailyForecast[date].min)} °C
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={12} sm={6} md={12} lg={4} xl={4} xxl>
                  <div className="card-forecast h-100">
                    <p className="forecastTitle">
                      {today + 3} {monthName(month)}
                    </p>
                    {dailyForecast && (
                      <div>
                        {Object.keys(dailyForecast).map((date, index) => {
                          if (index === 1) {
                            return (
                              <div key={date}>
                                <div className="text-center">
                                  <img
                                    className=""
                                    src={`./src/assets/${dailyForecast[date].weather}.png`}
                                    alt="Wheater Image"
                                    height={60}
                                  />
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                  <p className="forecastTitle mb-0">
                                    {roundValue(dailyForecast[date].max)} °C
                                  </p>
                                  <p className="forecastTitle mb-0">
                                    {roundValue(dailyForecast[date].min)} °C
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={12} sm={6} md={12} lg={4} xl={4} xxl>
                  <div className="card-forecast h-100">
                    <p className="forecastTitle">
                      {today + 4} {monthName(month)}
                    </p>
                    {dailyForecast && (
                      <div>
                        {Object.keys(dailyForecast).map((date, index) => {
                          if (index === 1) {
                            return (
                              <div key={date}>
                                <div className="text-center">
                                  <img
                                    className=""
                                    src={`./src/assets/${dailyForecast[date].weather}.png`}
                                    alt="Wheater Image"
                                    height={60}
                                  />
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                  <p className="forecastTitle mb-0">
                                    {roundValue(dailyForecast[date].max)} °C
                                  </p>
                                  <p className="forecastTitle mb-0">
                                    {roundValue(dailyForecast[date].min)} °C
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={12} sm={6} md={12} lg={4} xl={4} xxl>
                  <div className="card-forecast h-100">
                    <p className="forecastTitle">
                      {today + 5} {monthName(month)}
                    </p>
                    {dailyForecast && (
                      <div>
                        {Object.keys(dailyForecast).map((date, index) => {
                          if (index === 1) {
                            return (
                              <div key={date}>
                                <div className="text-center">
                                  <img
                                    className=""
                                    src={`./src/assets/${dailyForecast[date].weather}.png`}
                                    alt="Wheater Image"
                                    height={60}
                                  />
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                  <p className="forecastTitle mb-0">
                                    {roundValue(dailyForecast[date].max)} °C
                                  </p>
                                  <p className="forecastTitle mb-0">
                                    {roundValue(dailyForecast[date].min)} °C
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              <Row className="mt-5 mb-4">
                <Col>
                  <h4 className="itemsTitle mt-2">Today's Highlight</h4>
                </Col>
              </Row>
              <Row className="g-5">
                <Col lg={6}>
                  <div className="card-items h-100">
                    <p className="forecastTitle">Wind Status</p>
                    {wind && (
                      <>
                        <p className="itemsValue">
                          {convertToKmxH(wind.speed)}
                          <small className="smallText"> km/h</small>
                        </p>
                        <div className="d-flex align-items-center justify-content-center gap-2 mt-4">
                          <div className="text-center">
                            <span
                              className="material-symbols-outlined bgWind"
                              style={{ transform: `rotate(${windDegrees}deg)` }}
                            >
                              navigation
                            </span>
                          </div>
                          <div>
                            <p className="forecastTitle mb-0">{direction}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="card-items h-100">
                    <p className="forecastTitle">Humidity</p>
                    {temperature && (
                      <>
                        <p className="itemsValue">
                          {temperature.humidity}
                          <small className="smallText"> %</small>
                        </p>
                        <div className="d-flex justify-content-center">
                          <div className="d-flex flex-row justify-content-between w-75 mb-1">
                            <span className="forecastTitle">0</span>
                            <span className="forecastTitle">50</span>
                            <span className="forecastTitle">100</span>
                          </div>
                        </div>
                        <div className="d-flex justify-content-center">
                          <progress
                            max="100"
                            value={temperature.humidity}
                          ></progress>
                        </div>
                        <div className="d-flex justify-content-center">
                          <div className="text-end w-75">
                            <span className="forecastTitle">%</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="card-items h-100">
                    <p className="forecastTitle">Visibility</p>
                    {visibility && (
                      <>
                        <p className="itemsValue">
                          {convertToKm(visibility)}
                          <small className="smallText"> Km</small>
                        </p>
                      </>
                    )}
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="card-items h-100">
                    <p className="forecastTitle">Air Pressure</p>
                    {temperature && (
                      <>
                        <p className="itemsValue">
                          {temperature.pressure}
                          <small className="smallText"> mb</small>
                        </p>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
