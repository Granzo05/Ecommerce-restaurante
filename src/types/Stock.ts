import { Ingrediente } from "./Ingrediente";

export class Stock {
    fechaIngreso: Date = new Date();
    id: number = 0;
    cantidad: number = 0;
    ingrediente: Ingrediente = new Ingrediente();

    constructor() {
        
    }
}