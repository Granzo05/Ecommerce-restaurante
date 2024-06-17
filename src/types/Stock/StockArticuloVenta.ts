import { Ingrediente } from "../Ingredientes/Ingrediente";
import { Medida } from "../Ingredientes/Medida";
import { ArticuloVenta } from "../Productos/ArticuloVenta";

export class StockArticuloVenta {
    id: number = 0;
    articuloVenta: ArticuloVenta = new ArticuloVenta();
    ingrediente: Ingrediente | null = null;
    precioCompra: number = 0;
    cantidadActual: number = 0;
    cantidadMinima: number = 0;
    cantidadMaxima: number = 0;
    medida: Medida | null = null;
    borrado: string = '';
    fechaLlegadaProxima: Date | null = null;

    constructor() {
    }
}