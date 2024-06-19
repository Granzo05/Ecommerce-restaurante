import { Sucursal } from "./Sucursal";

export class Roles {
    id: number = 0;
    nombre: string = '';
    borrado: string = '';
    sucursales: Sucursal[] = [];

    constructor() {
    }
}