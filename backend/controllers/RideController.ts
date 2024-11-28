import { Request, Response } from "express";
const dayjs = require('dayjs');
const DriverDB = require('../models_DB/driver');
const ReviewDB = require('../models_DB/review');
const RideDB = require('../models_DB/ride');
const CustomerDB = require('../models_DB/customer');
import { Driver } from '../models/Driver';
import { Review } from "../models/Review";
const path = require('path');
const envPath = path.resolve(__dirname, '../../.env');
require('dotenv').config({ path: envPath });

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
    const myHeaders: Headers = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Goog-Api-Key", `${process.env.GOOGLE_API}`);
    myHeaders.append("X-Goog-FieldMask", "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.startLocation,routes.legs.endLocation");

    const req_body: string = JSON.stringify({
        "origin": {
            "address": coordinates[0]
        },
        "destination": {
            "address": coordinates[1]
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
async function valid_drivers(driver_id: number, distance: number): Promise<number> {
    var value: number = 200;
    const _driver: Driver = await DriverDB.findOne({ where: { driver_id } });

    if (_driver != null) {
        value = _driver.km <= distance ? 200 : 406
    }
    else value = 404;

    return value;
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
    if(route == "Erro ao obter rotas, contate o desenvolvedor para checar os logs!") return res.status(401).json({
        "error_code": "API_ERROR",
        "error_description": "Erro na API. Contate o desenvolvedor!"
    });
    var route_obj = JSON.parse(route);
    const result_filtered = {
        "distance": route_obj.routes[0].distanceMeters,
        "duration": route_obj.routes[0].duration
    }

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
            "latitude": Number(route_obj.routes[0].legs[0].startLocation.latLng.latitude),
            "longitude": Number(route_obj.routes[0].legs[0].startLocation.latLng.longitude)
        },
        "destination": {
            "latitude": Number(route_obj.routes[0].legs[0].endLocation.latLng.latitude),
            "longitude": Number(route_obj.routes[0].legs[0].endLocation.latLng.longitude)
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

    /**Validação dos campos em branco */
    const valid: boolean = validate_entries([customer_id, origin, destination, distance, duration, driver, value]);
    if (valid == false || origin == destination) {
        return res.status(400).json({
            "error_code": "INVALID_DATA",
            "error_description": "Os dados fornecidos no corpo da requisição são inválidos."
        });
    }

    /**Validação do motorista e KM */
    const validDriverKm: number = await valid_drivers(driver, distance);
    if (validDriverKm != 200) {
        if (validDriverKm == 404) return res.status(404).json({
            "error_code": "DRIVER_NOT_FOUND",
            "error_description": "Motorista não encontrado"
        });
        else if (validDriverKm == 406) return res.status(406).json({
            "error_code": "INVALID_DISTANCE",
            "error_description": "Quilometragem inválida para o motorista"
        });
    }

    const ride_obj = {
        "date": dayjs().format(),
        "origin": origin,
        "destination": destination,
        "distance": distance,
        "duration": duration,
        "value": value,
        "driver_id": driver,
        "customer_id": customer_id,
    };
    // console.log(ride_obj);

    try {
        const _new = await RideDB.create(ride_obj);
        return res.status(200).json({ "success": true });
    } catch (error) {
        return res.status(400).json({
            "error_code": "INVALID_DATA",
            "error_description": "Os dados fornecidos no corpo da requisição são inválidos.",
            error
        });
    }
}

async function getRidesByIds(req: Request, res: Response): Promise<any> {
    const customerId = req.params.customer_id;  // Acessando o parâmetro da URL
    const driverId = req.query.driver_id;

    //Validação de NaN
    if (isNaN(Number(customerId))) return res.status(400).json({
        message: 'Passageiro informado não é válido'
    });

    //Verifica se usuário existe
    const customer = await CustomerDB.findOne({
        where: {
            customer_id: customerId
        }
    });
    if (customer == null) {
        return res.status(400).json({
            message: 'Usuário não encontrado'
        });
    }

    //Se não houver motorista especificado,
    if (Number(driverId) == 18051998) {
        const rides = await RideDB.findAll({
            where: { customer_id: customerId }
        });

        if (rides != null) {
            if (rides.length == 0) return res.status(404).json({
                "error_code": "NO_RIDES_FOUND",
                "error_description": "Nenhum registro encontrado"
            });

            var rides_filtered: any[] = [];
            await Promise.all(rides.map(async (ride: any) => {
                const thisDriver = await DriverDB.findOne({
                    where: {
                        driver_id: ride.driver_id
                    }
                });

                const _ride = {
                    "id": ride.ride_id,
                    "date": ride.date,
                    "origin": ride.origin,
                    "destination": ride.destination,
                    "distance": Number(ride.distance),
                    "duration": ride.duration,
                    "driver": {
                        "id": thisDriver.driver_id,
                        "name": thisDriver.name
                    },
                    "value": Number(ride.value)
                };

                rides_filtered.push(_ride);
            }));

            return res.status(200).json({
                "customer_id": String(customerId),
                "rides": rides_filtered,
            });
        } else {
            return res.status(400).json({
                error_code: 'Erro'
            });
        }
    } else {
        //Verifica se motorista existe
        const driver = await DriverDB.findOne({
            where: {
                driver_id: driverId
            }
        });
        if (isNaN(Number(driverId))) {
            return res.status(400).json({
                "error_code": "INVALID_DRIVER",
                "error_description": 'Motorista invalido'
            });
        }
        if (driver == null) {
            return res.status(404).json({
                "error_code": "INVALID_DRIVER",
                "error_description": 'Motorista invalido'
            });
        }

        const rides = await RideDB.findAll({
            where: { customer_id: customerId, driver_id: driverId }
        })

        if (rides != null) {
            if (rides.length == 0) return res.status(404).json({
                "error_code": "NO_RIDES_FOUND",
                "error_description": "Nenhum registro encontrado"
            });

            var rides_filtered: any[] = [];
            await Promise.all(rides.map(async (ride: any) => {
                const thisDriver = await DriverDB.findOne({
                    where: {
                        driver_id: ride.driver_id
                    }
                });

                const _ride = {
                    "id": ride.ride_id,
                    "date": ride.date,
                    "origin": ride.origin,
                    "destination": ride.destination,
                    "distance": Number(ride.distance),
                    "duration": ride.duration,
                    "driver": {
                        "id": thisDriver.driver_id,
                        "name": thisDriver.name
                    },
                    "value": Number(ride.value)
                };

                rides_filtered.push(_ride);
            }));

            return res.status(200).json({
                "customer_id": String(customerId),
                "rides": rides_filtered,
            });
        } else {
            return res.status(400).json({
                message: 'Erro'
            });
        }
    }
}

module.exports = {
    estimate,
    confirm,
    getRidesByIds,
};