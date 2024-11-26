export class Driver{ 
    driver_id: number; 
    name: string; 
    description: string; 
    vehicle: string; 
    value: number; 
    km: number;

    constructor(driver_id: number, name: string, description: string, vehicle: string, value: number, km: number) {
        this.driver_id= driver_id;
        this.name= name;
        this.description= description;
        this.vehicle= vehicle;
        this.value= value;
        this.km= km;
    }
};