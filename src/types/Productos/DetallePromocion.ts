import { Medida } from "../Ingredientes/Medida";
import { ArticuloMenu } from "./ArticuloMenu";
import { ArticuloVenta } from "./ArticuloVenta";

export class DetallePromocion {
    id: number = 0;
    cantidad: number = 0;
    medida: Medida = new Medida();
    articuloMenu: ArticuloMenu | null = null;
    articuloVenta: ArticuloVenta | null = null;

    constructor() {

    }
}