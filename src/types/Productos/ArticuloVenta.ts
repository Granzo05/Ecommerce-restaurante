import { Articulo } from "./Articulo";
import { EnumMedida } from "../Ingredientes/EnumMedida";
import { EnumTipoArticuloComida } from "./EnumTipoArticuloComida";
import { StockArticuloVenta } from "../Stock/StockArticuloVenta";

export class ArticuloVenta extends Articulo {
    id: number = 0;
    tipo: EnumTipoArticuloComida | null = null;
    medida: EnumMedida | null = null;
    cantidadMedida: number = 0;
    stock: StockArticuloVenta | null = null;

    constructor() {
        super();
    }
}