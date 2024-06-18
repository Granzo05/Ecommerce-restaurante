import { Sucursal } from "../Restaurante/Sucursal";

export class Medida {
    id: number = 0;
    nombre: string = '';
    borrado: string = '';
    sucursales: Sucursal[] = [];

    constructor() {
    }
}