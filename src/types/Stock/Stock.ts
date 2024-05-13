import { EnumMedida } from "../Ingredientes/EnumMedida";

export class Stock {
    id: number = 0;
    precioCompra: number = 0;
    cantidadActual: number = 0;
    cantidadMinima: number = 0;
    cantidadMaxima: number = 0;
    medida: EnumMedida | string = '';

    constructor() {
        
    }
}