import { Productos } from "./Productos";

export class Carrito {
    productos: Productos[] = [];
    subTotal: number = 0;
    totalProductos: number = 0;
    totalPrecio: number = 0;

    constructor(){
    }
}