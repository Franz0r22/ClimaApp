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
      apiCall(lat, lon, setTemperature, setWeather, setLocation);
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
  const roundTemp = (temperature) => {
    return Math.round(temperature);
  }

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

  const dayName = today => {
    return dayNames[new Date(today).getDay()];
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
      {/* <Container className="py-5">
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search location"
                aria-label="Search location"
                aria-describedby="search"
                ref={cityRef}
              />
              <Button
              variant="outline-secondary"
              id="search-button"
              onClick={ handleClickSearch }
              >
              Search...
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col className='text-center'>
            {temperature && <p>La temperatura actual es {temperature.temp}</p>}
          </Col>
        </Row>
      </Container> */}
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
                  {roundTemp(temperature.temp)}
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
          <Col lg={9}></Col>
        </Row>
      </Container>
    </>
  );
}

export default App
