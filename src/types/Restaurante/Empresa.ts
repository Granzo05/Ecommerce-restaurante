import { Imagenes } from "../Productos/Imagenes";

export class Empresa {
    id: number = 0;
    cuit: string = '';
    nombre: string = '';
    contraseña: string = '';
    razonSocial: string = '';
    imagenes: Imagenes[] = [];
    borrado: string = '';

    constructor() { }
}