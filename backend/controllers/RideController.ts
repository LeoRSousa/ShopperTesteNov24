import { Request, Response } from "express";
const DriverDB = require('../models_DB/driver');
const ReviewDB = require('../models_DB/review');
import { Driver } from '../models/Driver';
import { Review } from "../models/Review";

function test(req: Request, res: Response): any {
    return res.status(200).json({
        message: 'Success'
    });
}

/**Faz o join na tabela (feat futura, adaptar o sequelize para realizar isso) */
export async function driversAndReviews(): Promise<any[]> {
    const drivers = await DriverDB.findAll({});
    const reviews = await ReviewDB.findAll({});
    var merged: any[] = [];
    drivers.forEach((driver: Driver) => {
        const match = reviews.find((review: Review) => review.driver_id == driver.driver_id);
        merged.push({
            "driver_id": driver.driver_id,
            "name": driver.name,
            "description": driver.description,
            "vehicle": driver.vehicle,
            "review": {
                "rating": match.rating,
                "comment": match.comment
            },
            "value": driver.value,
            "km": driver.km,
        });
    });
    return merged;
}

/**
 * Retornar a lista dos motoristas que aceitariam a viagem(km min.) e valor da corrida
 */
async function drivers(distance: number): Promise<any[]> {
    const drivers: any[] = await driversAndReviews();
    var _driversOk: any[] = [];
    drivers.forEach((element: any) => {
        if (element.km <= distance) {
            const val = element.value * distance;
            _driversOk.push({
                id: element.driver_id,
                name: element.name,
                description: element.description,
                vehicle: element.vehicle,
                review: element.review,
                value: val.toFixed(2)
            }); // Inclui o motorista no array filtrado
        }
    });
    return _driversOk;
}

/**[Rotes API - Google Maps]
 * Recebe as coordenadas e envia para a API calcular e retornar a distancia e o tempo
 */
async function computeRoute(coordinates: string[]): Promise<string> {
    const origin: string[] = coordinates[0].split(',');
    const destination: string[] = coordinates[1].split(',');
    const myHeaders: Headers = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Goog-Api-Key", "AIzaSyAgB4kpNS6VLRoA2Vk0a15EFU_H9PpXaI8");
    myHeaders.append("X-Goog-FieldMask", "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline");

    const req_body: string = JSON.stringify({
        "origin": {
            "location": {
                "latLng": {
                    "latitude": origin[0],
                    "longitude": origin[1]
                }
            }
        },
        "destination": {
            "location": {
                "latLng": {
                    "latitude": destination[0],
                    "longitude": destination[1]
                }
            }
        },
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE",
        "computeAlternativeRoutes": false,
        "routeModifiers": {
            "avoidTolls": false,
            "avoidHighways": false,
            "avoidFerries": false
        },
        "languageCode": "pt-BR",
        "units": "METRIC"
    });

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: req_body,
        redirect: "follow"
    };

    try {
        const response = await fetch(
            "https://routes.googleapis.com/directions/v2:computeRoutes",
            requestOptions
        );
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }
        const result = await response.json();
        return JSON.stringify(result);
    } catch (error: any) {
        console.error(error);
        return "Erro ao obter rotas, contate o desenvolvedor para checar os logs!"
    }
}

/**Motorista válido e km p/ motorista é válida? */
async function valid_drivers(drivers: any[]): Promise<boolean> {
    var valid: boolean = true;
    const _drivers = await DriverDB.findAll({});

    drivers.forEach(driver => {
        valid = _drivers.some((obj: { driver_id: any; }) => obj.driver_id == driver.driver_id);
    })


    return valid;
}

function validate_entries(entries: any[]): boolean {
    var valid: boolean = true;

    //Caso alguma entrada seja inválida, atribui valor falso à variável 'valid'
    entries.forEach((entry) => {
        if (entry == null || entry == '' || entry == undefined) valid = false;
    })

    return valid;
}

/** Recebe a origem e o destino da viagem e realiza os cálculos dos valores da viagem.*/
async function estimate(req: Request, res: Response): Promise<any> {
    const { customer_id, origin, destination } = req.body;

    //Validações: 1) Endereços não podem estar em branco; 2) user_id não pode estar em branco; 3)Origem e Destion não podem ser iguais
    const valid: boolean = validate_entries([customer_id, origin, destination]);

    //Caso não passe pelas validações:
    /*** Status Code = 400;
     * Descricao = "Os dados fornecidos no corpo da requisição são inválidos";
     * Response body:
        {
            "error_code": "INVALID_DATA",
            "error_description": string
        }
    */
    if (valid == false || origin == destination) {
        return res.status(400).json({
            "error_code": "INVALID_DATA",
            "error_description": "Os dados fornecidos no corpo da requisição são inválidos"
        });
    }

    //Caso passe pelas validações:
    /**Calcular a rota pela Routes API */
    var route: string = await computeRoute([origin, destination]);
    var route_obj = JSON.parse(route);
    const result_filtered = {
        "distance": route_obj.routes[0].distanceMeters,
        "duration": route_obj.routes[0].duration
    }

    const origin_obj: string[] = origin.split(',');
    const destination_obj: string[] = destination.split(',');

    const _drivers: any[] = await drivers(result_filtered.distance / 1000);

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
    const response_body = {
        "origin": {
            "latitude": Number(origin_obj[0]),
            "longitude": Number(origin_obj[1])
        },
        "destination": {
            "latitude": Number(destination_obj[0]),
            "longitude": Number(destination_obj[1])
        },
        "distance": result_filtered.distance,
        "duration": result_filtered.duration,
        "options": _drivers,
        "routeResponse": route_obj //= Resposta original da rota do Google
    }

    return res.status(200).json(response_body);
}

/** Responsável por confirmar a viagem e gravá-la no histórico.*/
async function confirm(req: Request, res: Response): Promise<any> {
    /**Request body:
    { 
        "customer_id": string, 
        "origin": string, 
        "destination": string, 
        "distance": number, 
        "duration": string, 
        "driver": { 
            "id": number, 
            "name": string 
        }, 
        "value": number 
    }
     */
    const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

    const valid: boolean = validate_entries([customer_id, origin, destination]);
    if (valid == false || origin == destination) {
        return res.status(400).json({
            "error_code": "INVALID_DATA",
            "error_description": "Os dados fornecidos no corpo da requisição são inválidos"
        });
    }
}

module.exports = {
    test,
    estimate
};