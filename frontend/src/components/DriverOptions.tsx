import React from "react";
import '../App.css';

// Define a interface para o tipo dos dados esperados em options
interface Review {
  rating: number;
  comment: string;
}

interface DriverOption {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: Review;
  value: number;
}

interface DriverChose {
  driver: {
    id: number,
    name: string,
  },
  value: number
}

// Define as props do componente
interface DriverOptionsProps {
  options: DriverOption[];
  getDriver: (selected: DriverChose) => void;
}

// Corrige a assinatura do componente para aceitar um objeto com a propriedade options
export default function DriverOptions({ options, getDriver }: DriverOptionsProps,) {
  function choose(driver: DriverChose, event: React.MouseEvent<HTMLButtonElement>) {
    console.log(driver);
    getDriver(driver);
  }
  
  return (
    <div>
      <h2>Opções de motoristas:</h2>
      <table>
        <thead>
          <tr>
            <th>Num. do Motorista</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Veículo</th>
            <th>Avaliação</th>
            <th>Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {options.map((opt) => (
            <tr key={opt.id}>
              <td>{opt.id}</td>
              <td>{opt.name}</td>
              <td>{opt.description}</td>
              <td>{opt.vehicle}</td>
              <td>
                {opt.review.rating}/5  {opt.review.comment}
              </td>
              <td>{String(opt.value).replace(".", ",")}</td>
              <td>
                <button onClick={(event) => choose({
                  "driver": {
                    "id": opt.id,
                    "name": opt.name,
                  },
                  "value": opt.value
                }, event)}>Escolher este</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
