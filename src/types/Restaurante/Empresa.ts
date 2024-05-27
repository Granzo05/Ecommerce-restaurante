import { Imagenes } from "../Productos/Imagenes";
import { ImagenesProductoDTO } from "../Productos/ImagenesProductoDTO";

export class Empresa {
    id: number = 0;
    cuit: string = '';
    nombre: string = '';
    razonSocial: string = '';
    imagenes: Imagenes[] = [];
    imagenesDTO: ImagenesProductoDTO[] = [];
    borrado: string = '';

    constructor() { }
}