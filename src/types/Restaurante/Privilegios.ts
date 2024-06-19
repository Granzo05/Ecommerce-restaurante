import { Sucursal } from "./Sucursal";

export class Privilegios {
    id: number = 0;
    tarea: string = '';
    borrado: string = '';
    permisos: string[] = [];
    sucursales: Sucursal[] = [];

    constructor(id: number, tarea: string, permisos: string[]) {
        this.id = id;
        this.tarea = tarea;
        this.permisos = permisos;
    }
}