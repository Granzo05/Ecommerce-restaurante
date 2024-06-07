import { Ingrediente } from "../Ingredientes/Ingrediente";
import { Medida } from "../Ingredientes/Medida";

export class StockIngredientes {
    id: number = 0;
    ingrediente: Ingrediente | null = null;
    precioCompra: number = 0;
    cantidadActual: number = 0;
    cantidadMinima: number = 0;
    cantidadMaxima: number = 0;
    medida: Medida | null = null;
    borrado: string = '';

    constructor() {
    }
}