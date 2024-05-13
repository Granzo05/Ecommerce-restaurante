import { Articulo } from "./Articulo";
import { EnumMedida } from "../Ingredientes/EnumMedida";
import { EnumTipoArticuloVenta } from "./EnumTipoArticuloVenta";

export class ArticuloVenta extends Articulo {
    id: number = 0;
    tipo: EnumTipoArticuloVenta | string = '';
    medida: EnumMedida | string = '';
    cantidadMedida: number = 0;

    constructor() {
        super();
    }
}