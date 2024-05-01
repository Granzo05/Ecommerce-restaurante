import { EnumMedida } from "../Ingredientes/EnumMedida";
import { ArticuloMenu } from "../Productos/ArticuloMenu";
import { ArticuloVenta } from "../Productos/ArticuloVenta";
import { StockEntrante } from "./StockEntrante";

export class DetalleStock {
    id: number = 0;
    cantidad: number = 0;
    medida: EnumMedida | null = null;
    articuloMenu: ArticuloMenu | null = null;
    articuloVenta: ArticuloVenta | null = null;
    stockEntrante: StockEntrante | null = null;

    constructor() {

    }
}