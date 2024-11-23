import { Request, Response } from "express";

function test(req: Request, res: Response): any {
    return res.status(200).json({
        message: 'Success'
    });
}

function validate_entries(entries: any[]): boolean {
    var valid: boolean = true;

    //Caso alguma entrada seja inválida, atribui valor falso à variável 'valid'
    entries.forEach((entry) => {
        if(entry == null || entry == '' || entry == undefined) valid = false;
    })

    return valid;
} 

async function estimate(req: Request, res: Response): Promise<any> {
    //Recebe a origem e o destino da viagem e realiza os cálculos dos valores da viagem.
    /**
     * Request body:
        {
            "customer_id": string,
            "origin": string,
            "destination": string
        }
    */
    const { customer_id, origin,  destination } = req.body;

    //Validações: 1) Endereços não podem estar em branco; 2) user_id não pode estar em branco; 3)Origem e Destion não podem ser iguais
    const valid: boolean = validate_entries([customer_id, origin, destination]);
    if(valid == false || origin == destination) {
        return res.status(400).json({ 
            "error_code": "INVALID_DATA",
            "error_description": "Os dados fornecidos no corpo da requisição são inválidos"
        });
    }

    //Caso não passe pelas validações:
    /**
     * Status Code = 400;
     * Descricao = "Os dados fornecidos no corpo da requisição são inválidos";
     * Response body:
        {
            "error_code": "INVALID_DATA",
            "error_description": string
        }
    */

    //Caso passe pelas validações:
    /**
     * Calcular a rota na API Routes
     * Listar os motoristas que aceitariam a viagem(km min.) e valor da corrida
     */

    //Retorno do endpoint
    /**
     * Status Code = 200
     * Descrição = "Operação realizada com sucesso"
     * Response body:
     *  {
            "origin": {
                "latitude": number,
                "longitude": number
            },
            "destination": {
                "latitude": number,
                "longitude": number
            },
            "distance": number,
            "duration": string,
            "options": [
                {
                    "id": number,
                    "name": string,
                    "description": string,
                    "vehicle": string,
                    "review": {
                        "rating": number,
                        "comment": string
                    },
                    "value": number
                }
            ],
            "routeResponse": object //= Resposta original da rota do Google
        }
    */

    return;
}

module.exports = {
    test,
    estimate
};