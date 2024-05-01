import { Articulo } from "./Articulo";
import { ArticuloMenu } from "./ArticuloMenu";
import { ImagenesProducto } from "./ImagenesProducto";

export class Promocion {
    id: number = 0;
    nombre: string = '';
    descripcion: string = '';
    fechaDesde: Date | null = null;
    fechaHasta: Date | null = null;
    articulos: Articulo[] = [];
    articulosMenu: ArticuloMenu[] = [];
    imagenes: ImagenesProducto[] = [];
    precio: number = 0;

    constructor() {
    }
}