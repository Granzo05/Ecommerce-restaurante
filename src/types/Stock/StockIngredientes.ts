import { Ingrediente } from "../Ingredientes/Ingrediente";
import { Medida } from "../Ingredientes/Medida";
import { ArticuloVenta } from "../Productos/ArticuloVenta";

export class StockIngredientes {
    id: number = 0;
    ingrediente: Ingrediente | null = new Ingrediente();
    articuloVenta: ArticuloVenta | null = null;
    precioCompra: number = 0;
    cantidadActual: number = 0;
    cantidadMinima: number = 0;
    cantidadMaxima: number = 0;
    medida: Medida = new Medida();
    borrado: string = '';
    fechaLlegadaProxima: Date | null = null;

    constructor() {
    }
}