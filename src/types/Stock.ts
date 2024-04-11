import { Ingrediente } from "./Ingrediente";
import { Restaurante } from "./Restaurante";

export class Stock {
    fechaIngreso: Date = new Date();
    id: number = 0;
    cantidad: number = 0;
    costo: number = 0;
    medida: string = '';
    restaurante: Restaurante = new Restaurante();
    ingrediente: Ingrediente = new Ingrediente();

    constructor() {
        
    }
}