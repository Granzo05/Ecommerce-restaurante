import { ArticuloMenuDTO } from "../Productos/ArticuloMenuDTO";
import { ArticuloVenta } from "../Productos/ArticuloVenta";

export class Carrito {
    articuloMenu: ArticuloMenuDTO[] = [];
    articuloVenta: ArticuloVenta[] = [];
    totalProductos: number = 0;
    totalPrecio: number = 0;

    constructor(){
    }
}