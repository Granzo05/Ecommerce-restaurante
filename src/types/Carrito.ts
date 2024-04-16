import { Menu } from "./Menu";

export class Carrito {
    menu: Menu[] = [];
    cantidad: number[] = [];
    precio: number[] = [];
    imagenSrc: string[] = [];
    totalProductos: number = 0;
    totalPrecio: number = 0;
    
    constructor(){
    }
}