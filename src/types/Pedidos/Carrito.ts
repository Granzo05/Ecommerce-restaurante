import { ArticuloMenu } from "../Productos/ArticuloMenu";
import { ArticuloVenta } from "../Productos/ArticuloVenta";

export class Carrito {
    articuloMenu: ArticuloMenu[] = [];
    articuloVenta: ArticuloVenta[] = [];
    totalProductos: number = 0;
    totalPrecio: number = 0;

    constructor(){
    }
}