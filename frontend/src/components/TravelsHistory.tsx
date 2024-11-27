import React, { useState } from "react";
import '../App.css';

export default function TravelsHistory() {
    const [customerId, setCustomerId] = useState(1);
    const [driverId, setDriverId] = useState<string>();
    const [rides, setRides] = useState<any[]>();
    const [hasSearch, setHasSearch] = useState(false);

    function handleID(event: React.ChangeEvent<HTMLInputElement>) {
        var _id = Number(event.currentTarget.value);
        setCustomerId(_id);
    }

    function handleDriverId(event: React.ChangeEvent<HTMLInputElement>) {
        var _id = event.currentTarget.value;
        setDriverId(_id);
    }

    async function handleSend() {
        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow"
        };

        try {
            var url: string = `http://localhost:8000/ride/${customerId}?driver_id=${driverId}`;
            if(driverId === undefined || driverId === '') url = `http://localhost:8000/ride/${customerId}?driver_id=18051998`;
            else if(isNaN(Number(driverId))) url = `http://localhost:8000/ride/${customerId}?driver_id=20242042`;
            const response = await fetch(url, requestOptions);
            const result = await response.json();
            switch (response.status) {
                case 200:
                    setRides(result.rides);
                    break;
                case 404:
                    const emptyArray = [];
                    setRides(emptyArray);
                    break;
                case 400:
                    break;
                default:
                    break;
            }
            if (!response.ok) {
                if(result.error_code === "INVALID_DRIVER") alert("Motorista invalido");
                throw new Error(`${response.status}`);
            }
            setHasSearch(true);
        } catch (error) {
            if (error === "400") alert("Motorista invalido");
        }
    }

    return (
        <>
            <div>
                <label>
                    ID de usuário:&nbsp;
                    <input type="number" value={customerId} onChange={handleID} />
                </label>
                <br></br>
                <label>
                    ID de motorista:&nbsp;
                    <input type="text" value={driverId} onChange={handleDriverId} />
                </label>
                <br></br>
                <button onClick={handleSend}>Pesquisar</button>
            </div>
            <div>
                {hasSearch ? <div>
                    <h2>Histórico de viagens</h2>
                    {rides != null ?
                        rides.length > 0 ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>Data e hora</th>
                                        <th>Motorista</th>
                                        <th>Origem</th>
                                        <th>Destino</th>
                                        <th>Distância</th>
                                        <th>Tempo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rides.map((ride) => (
                                        <tr key={ride.id}>
                                            <th>{new Date(ride.date).toLocaleString('pt-BT', { timeZone: 'America/Sao_Paulo', hour12: false })}</th>
                                            <th>{ride.driver.name}</th>
                                            <th>{ride.origin}</th>
                                            <th>{ride.destination}</th>
                                            <th>{(ride.distance / 1000).toFixed(2)} Km</th>
                                            <th>{Math.ceil(Number(ride.duration.replace('s', '')) / 60)} min.</th>
                                            <th>R$ {ride.value}</th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            : <div>Nenhum registro encontrado</div>
                        : null}
                </div> : <div></div>}
            </div>
        </>
    );
}