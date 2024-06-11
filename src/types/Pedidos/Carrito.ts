import { ArticuloMenu } from "../Productos/ArticuloMenu";
import { ArticuloVenta } from "../Productos/ArticuloVenta";
import { Promocion } from "../Productos/Promocion";

export class Carrito {
    articuloMenu: ArticuloMenu[] = [];
    articuloVenta: ArticuloVenta[] = [];
    promociones: Promocion[] = [];
    totalProductos: number = 0;
    totalPrecio: number = 0;

    constructor(){
    }
}