import { Articulo } from "./Articulo";
import { ArticuloMenu } from "./ArticuloMenu";
import { Imagenes } from "./Imagenes";

export class Promocion {
    id: number = 0;
    nombre: string = '';
    descripcion: string = '';
    fechaDesde: Date | null = null;
    fechaHasta: Date | null = null;
    articulos: Articulo[] = [];
    articulosMenu: ArticuloMenu[] = [];
    imagenes: Imagenes[] = [];
    precio: number = 0;
    borrado: string = '';

    constructor() {
    }
}