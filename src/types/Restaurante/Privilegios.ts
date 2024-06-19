import { Sucursal } from "./Sucursal";

export class Privilegios {
    id: number = 0;
    nombre: string = '';
    borrado: string = '';
    permisos: string[] = [];
    sucursales: Sucursal[] = [];

    constructor(id: number, nombre: string, borrado: string) {
        this.id = id;
        this.nombre = nombre;
        this.borrado = borrado;
    }
}