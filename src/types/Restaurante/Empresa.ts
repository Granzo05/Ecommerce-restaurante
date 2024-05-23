import { ImagenesProducto } from "../Productos/ImagenesProducto";
import { ImagenesProductoDTO } from "../Productos/ImagenesProductoDTO";

export class Empresa {
    id: number = 0;
    cuit: string = '';
    nombre: string = '';
    razonSocial: string = '';
    imagenes: ImagenesProducto[] = [];
    imagenesDTO: ImagenesProductoDTO[] = [];
    borrado: string = '';

    constructor() { }
}