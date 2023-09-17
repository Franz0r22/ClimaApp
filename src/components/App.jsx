import { useState, useEffect, useRef } from 'react'
import { locationCall, apiCall } from '../services/fetch';
import '../App.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


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

  //referencias
  const cityRef = useRef();


  //Efectos
  useEffect(() => {
    if (city != undefined) {
      locationCall(city, setLat, setLon);
    }
  }, [city]);
  
  useEffect(() => {
    if (lat !== undefined && lon !== undefined) {
      apiCall(lat, lon, setTemperature, setWeather, setLocation, setWind, setWindDegrees, setVisibility);
    }
  }, [lat, lon]);

//Efecto ubicación actual
const getCurrentLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
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


  //Eventos
  const handleClickSearch = () => {
    setCity(cityRef.current.value)
    cityRef.current.value = "";
    setMenuOpen(!menuOpen);
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickResetLocation = () => {
    getCurrentLocation();
  }

  //Round
  const roundValue = (value) => {
    return Math.round(value);
  }

  //Convertir Mts/s a Km/h
  const convertToKmxH = (value) => {
    return roundValue(value * 3.6)
  }

  //Convertir Mts a Kms
  const convertToKm = (value) => {
    return roundValue(value/100);
  }


  //Dirección del viento
  const windDirection = (windDegrees) => {
    // Direcciones cardinales en orden
    const cardinalDirections = ['North', 'North-Northeast', 'Northeast', 'East-Northeast', 'East', 'East-Southeast', 'Southeast', 'South-Southeast', 'South', 'South-Southwest', 'Southwest', 'West-Southwest', 'West', 'West-Northwest', 'Northwest', 'North-Northwest', 'North'];
  
    // Calcular el índice en el arreglo usando los grados
    const index = Math.round((windDegrees % 360) / 22.5);
    
    // Asegurarse de que el índice esté dentro del rango del arreglo
    const directionIndex = index >= 0 && index < cardinalDirections.length ? index : 0;
  
    // Devolver la dirección cardinal correspondiente
    return cardinalDirections[directionIndex];
  };
  
  const direction = windDirection(windDegrees);

  //Fecha
  const date = new Date();
  const today = date.getDate();
  const month = date.getMonth() + 1;

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dayName = () => {
    const day = date.getDay();
    return dayNames[day];
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  
  const monthName = month => {
    return monthNames[month - 1];
  };  


  return (
    <>
      <Container fluid>
        <Row>
          <Col lg={3} className="sideBlock">
            <div className='cloudBlock'></div>
            <div className="d-flex justify-content-between align-items-center mx-4 mt-5">
              <button className="btn-places" onClick={toggleMenu}>Search for places</button>
              <div className="bgIcon">
                <span className="material-symbols-outlined colorIcon" onClick={handleClickResetLocation}>
                  my_location
                </span>
              </div>
            </div>
            {weather && (
            <div className="text-center mt-image">
              <img className="imgWeather" src={`./src/assets/${weather.description}.png`} alt="Wheater Image" />
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
            <div className='mt-4'>
              {weather && <h2 className="weatherTitle mt-2">{weather.main}</h2>}
            </div>
            <div className='d-flex align-items-center justify-content-center mt-4'>
              <span className="material-symbols-outlined locationIcon">location_on</span>
              {location && (
                <h2 className="locationTitle mt-2">
                  {location}
                </h2>
              )}
            </div>
            <div className='locationTitle my-4'>
              {dayName(today)}, {today} {monthName(month)}
            </div>
            <div className={menuOpen ? 'menu-location open' : 'menu-location'}>
              <div className='text-end me-4'>
                <span className="material-symbols-outlined closeIcon" onClick={toggleMenu}>
                  close
                </span>
              </div>
              <div className='d-flex justify-content-center mt-3'>
              <div className='relative'>
                {/* <span class="material-symbols-outlined searchIcon absolute">
                  search
                </span> */}
                  <input className="inputSearch" type="text" placeholder="Search location" ref={cityRef}/>
              </div>
                <button className='btn-search' onClick={ handleClickSearch }>Search</button>
              </div>
            </div>
          </Col>
          <Col lg={9} className='contentBlock'>
            <Container className='containerBox'>
              <Row className="gx-4">
                <Col>
                  <div className='card-forecast'>
                   <p className='forecastTitle'>Tomorrow</p>
                  </div>
                </Col>
                <Col>
                  <div className='card-forecast'>
                    <p className='forecastTitle'>Monday</p>
                  </div>
                </Col>
                <Col>
                  <div className='card-forecast'>
                    <p className='forecastTitle'>Tuesday</p>
                  </div>
                </Col>
                <Col>
                  <div className='card-forecast'>
                   <p className='forecastTitle'>Wednesday</p>
                  </div>
                </Col>
                <Col>
                  <div className='card-forecast'>
                    <p className='forecastTitle'>Thursday</p>
                  </div>
                </Col>
              </Row>
              <Row className='mt-5 mb-4'>
                <Col>
                  <h4 className='itemsTitle mt-2'>Today's Highlight</h4>
                </Col>
              </Row>
              <Row className='g-5'>
                <Col lg={6}>
                  <div className='card-items'>
                    <p className='forecastTitle'>Wind Status</p>
                    { wind && 
                    <>
                      <p className='itemsValue'>{convertToKmxH(wind.speed)}
                        <small className='smallText'> km/h</small>
                      </p>
                      <p className='forecastTitle mb-0'>{direction}</p>                   
                    </>
                       } 
                  </div>
                </Col>
                <Col lg={6}>
                  <div  className='card-items'>
                    <p className='forecastTitle'>Humidity</p>
                    { temperature && 
                    <>
                      <p className='itemsValue'>{temperature.humidity}
                        <small className='smallText'> %</small>
                      </p>
                      <div class="d-flex justify-content-center">
                        <progress className='progressBar' max="100" value={temperature.humidity}></progress>               
                      </div>
                    </>
                       } 
                  </div>
                </Col>
                <Col lg={6}>
                  <div  className='card-items'>
                    <p className='forecastTitle'>Visibility</p>
                    { visibility && 
                    <>
                      <p className='itemsValue'>{convertToKm(visibility)}
                        <small className='smallText'> Km</small>
                      </p>                
                    </>
                       } 
                  </div>
                </Col>
                <Col lg={6}>
                  <div  className='card-items'>
                    <p className='forecastTitle'>Air pressure</p>
                    { temperature && 
                    <>
                      <p className='itemsValue'>{temperature.pressure}
                        <small className='smallText'> mb</small>
                      </p>                
                    </>
                       } 
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

export default App
