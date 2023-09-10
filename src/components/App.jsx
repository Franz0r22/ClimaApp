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
  const cityRef = useRef();


  //Efectos
  useEffect(() => {
    if (city != undefined) {
      locationCall(city, setLat, setLon, setTemperature);
    }
  }, [city]);
  
  useEffect(() => {
    if (lat !== undefined && lon !== undefined) {
      apiCall(lat, lon, setTemperature);
    }
  }, [lat, lon]);


  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const { latitude, longitude } = position.coords;
        
        setLat(latitude);
        setLon(longitude);

      });
    } else {
      console.error("La geolocalización no está disponible en este navegador.");
    }
  }, []);


  //Eventos
  const handleClickSearch = () => {
    setCity(cityRef.current.value)
  }

  return (
    <>
      <Container className="py-5">
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
      </Container>
    </>
  );
}

export default App
