import { Imagenes } from "./Imagenes";
import { Promocion } from "./Promocion";

export class Articulo {
    id: number = 0;
    nombre: string = '';
    precioVenta: number = 0;
    imagenes: Imagenes[] = [];
    promociones: Promocion[] = [];
    cantidad: number = 0;
    borrado: string = '';
    
    constructor(){}
}