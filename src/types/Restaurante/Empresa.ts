import { Imagenes } from "../Productos/Imagenes";

export class Empresa {
    id: number = 0;
    cuit: string = '';
    nombre: string = '';
    razonSocial: string = '';
    imagenes: Imagenes[] = [];
    borrado: string = '';

    constructor() { }
}