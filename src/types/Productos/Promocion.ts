import { DetallePromocion } from "./DetallePromocion";
import { Imagenes } from "./Imagenes";

export class Promocion {
    id: number = 0;
    nombre: string = '';
    descripcion: string = '';
    fechaDesde: Date = new Date();
    fechaHasta: Date = new Date();
    detallesPromocion: DetallePromocion[] = [];
    imagenes: Imagenes[] = [];
    precio: number = 0;
    borrado: string = '';

    constructor() {
    }
}