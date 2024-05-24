import { Ingrediente } from "../Ingredientes/Ingrediente";
import { Medida } from "../Ingredientes/Medida";
import { ArticuloVenta } from "../Productos/ArticuloVenta";
import { StockEntrante } from "./StockEntrante";

export class DetalleStock {
    id: number = 0;
    cantidad: number = 0;
    costoUnitario: number = 0;
    subTotal: number = 0;
    medida: Medida = new Medida();
    ingrediente: Ingrediente | null = null;
    articuloVenta: ArticuloVenta | null = null;
    stockEntrante: StockEntrante | null = null;
    borrado: string = '';

    constructor() {

    }
}