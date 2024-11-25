import React, { useState } from "react";

export default function GetTravel() {
    const [id, setId] = useState(0);
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

    return(
        <div>
            <label>
                ID de usuário:&nbsp;
                <input type="number" value={id} onChange={handleID}/>
            </label>
            <br></br>
            <label>
                Origem:&nbsp;
                <input type="text" value={origin} onChange={handleOrigin}/>
            </label>
            <br></br>
            <label>
                Destino:&nbsp;
                <input type="text" value={destination} onChange={handleDestination}/>
            </label>
        </div>
    );
}