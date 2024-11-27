import React, { useState } from 'react';
import './App.css';
import GetTravel from './components/GetTravel.tsx';
import DriverOptions from "./components/DriverOptions.tsx";
import StaticMap from './components/StaticMap.tsx';
import TravelsHistory from './components/TravelsHistory.tsx';

interface Travel {
  origin: object;
  destination: object;
  distance: number;
  duration: string;
  options: any[];
  routeResponse: object
};

interface DriverChose {
  driver: {
    id: number,
    name: string,
  },
  value: number
}

function App() {
  const [custumer, setCustumer] = useState<number>();
  const [originAddress, setOriginAddress] = useState<string>();
  const [destinationAddress, setDestinationAddress] = useState<string>();
  const [travel, seTravel] = useState<any>();
  const [driver, setDriver] = useState<DriverChose>();
  const [page, setPage] = useState<number>(1);

  const handleCustumer = (id: number) => {
    setCustumer(id);
  }

  const handleOriginAddress = (address: string) => {
    setOriginAddress(address);
  }

  const handleDestinationAddress = (address: string) => {
    setDestinationAddress(address);
  }

  const handleTravel = (travel: Travel) => {
    seTravel(travel);
  }

  const handlePage = (num: number) => {
    setPage(num);
  }

  const handleDriverChose = (selected: DriverChose) => {
    setDriver(selected);
    // console.log(selected);
    handleConfirmTravel();
  }

  const handleConfirmTravel = async () => {
    /**{
      "customer_id": 1, 
      "origin": "-22.43974178824043,-45.43635351347661",
      "destination": "-22.428181957602,-45.45386287577098", 
      "distance": 2.739, 
      "duration": "327", 
      "driver": { 
          "id": 1, 
          "name": "Hommer Simpson" 
      }, 
      "value": 6.85 
    } */

    if (driver !== undefined) {
      const req_body = {
        customer_id: custumer,
        origin: originAddress,
        destination: destinationAddress,
        distance: travel.distance,
        duration: travel.duration,
        driver: Number(driver.driver.id),
        value: Number(driver.value),
      }

      // console.log(req_body);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(req_body);

      const requestOptions: RequestInit = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      try {
        const response = await fetch("http://localhost:8000/ride/confirm", requestOptions);
        if (!response.ok) {
          if (response.status === 400) alert("Os dados inseridos são inválidos. Se todos campos estiverem preenchidos, é provável que o ID de usuário esteja errado! Adicione um ID válido e pesquise novamente!");
          throw new Error(`${response.status}`);
        }
        alert("Viagem criada!");
        handlePage(2);
      } catch (error) {
        if (error === 400) alert("Os dados fornecidos no corpo da requisição são inválidos.");
        else if (error === 404) alert("Motorista não encontrado");
        else if (error === 406) alert("Quilometragem inválida para o motorista");
      }
    } else {
      console.log("Driver === undefined");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {page === 1 ? <div>
          <GetTravel getTravel={handleTravel} customer_id={handleCustumer} origin_address={handleOriginAddress} destination_address={handleDestinationAddress} />
          <div>
            {travel !== undefined ? <StaticMap polyline={travel.routeResponse.routes[0].polyline.encodedPolyline} /> : null}
          </div>
          <div>
            {travel !== undefined ? <div><small>{(travel.distance / 1000).toFixed(2)} Km, {Math.ceil(Number(travel.duration.replace('s', '')) / 60)} min.</small></div> : null}
          </div>
          <div>
            {travel !== undefined ? <DriverOptions options={travel.options} getDriver={handleDriverChose} /> : null}
          </div>
        </div> : <div>
          <TravelsHistory />
        </div>}
      </header>
    </div>
  );
}

export default App;
