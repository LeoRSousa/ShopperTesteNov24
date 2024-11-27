import React, { useState } from "react";

interface GetTravelProps {
    getTravel: (travel: any) => void;
    customer_id: (id: number) => void;
    origin_address: (address: string) => void;
    destination_address: (address: string) => void;
}

export default function GetTravel({ getTravel, customer_id, origin_address, destination_address }: GetTravelProps) {
    const [id, setId] = useState(1);
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");

    function handleID(event: React.ChangeEvent<HTMLInputElement>) {
        var _id = Number(event.currentTarget.value)
        setId(_id);
    }

    function handleOrigin(event: React.ChangeEvent<HTMLInputElement>) {
        setOrigin(event.currentTarget.value);
    }

    function handleDestination(event: React.ChangeEvent<HTMLInputElement>) {
        setDestination(event.currentTarget.value);
    }

    async function handleSend() {
        // console.log(`ID: ${id}; Origem: ${origin}; Destino: ${destination}`);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "customer_id": id,
            "origin": origin,
            "destination": destination
        });

        const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("http://localhost:8000/ride/estimate", requestOptions);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }
            const result = await response.json();
            // console.log(result.options);
            // setDriverOptions(result.options);
            customer_id(id);
            origin_address(origin);
            destination_address(destination);
            getTravel(result);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div>
                <label>
                    ID de usuário:&nbsp;
                    <input type="number" value={id} onChange={handleID} />
                </label>
                <br></br>
                <label>
                    Origem:&nbsp;
                    <input type="text" value={origin} onChange={handleOrigin} />
                </label>
                <br></br>
                <label>
                    Destino:&nbsp;
                    <input type="text" value={destination} onChange={handleDestination} />
                </label>
                <br></br>
                <button onClick={handleSend}>Pesquisar</button>
            </div>
        </>
    );
}