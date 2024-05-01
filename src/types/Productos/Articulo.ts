import { ImagenesProducto } from "./ImagenesProducto";
import { Promocion } from "./Promocion";

export class Articulo {
    id: number = 0;
    nombre: string = '';
    precioVenta: number = 0;
    imagenes: ImagenesProducto[] = [];
    promociones: Promocion[] = [];
    cantidad: number = 0;
    
    constructor(){}
}