import { EnumMedida } from "../Ingredientes/EnumMedida";
import { Ingrediente } from "../Ingredientes/Ingrediente";
import { ArticuloVenta } from "../Productos/ArticuloVenta";
import { StockEntrante } from "./StockEntrante";

export class DetalleStock {
    id: number = 0;
    cantidad: number = 0;
    costoUnitario: number = 0;
    subTotal: number = 0;
    medida: EnumMedida | string = '';
    ingrediente: Ingrediente | null = null;
    articuloVenta: ArticuloVenta | null = null;
    stockEntrante: StockEntrante | null = null;
    borrado: string = '';

    constructor() {

    }
}