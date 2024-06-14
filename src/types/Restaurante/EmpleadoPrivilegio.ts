import { Privilegios } from "./Privilegios";

export class EmpleadoPrivilegio {
    id: number = 0;
    privilegio: Privilegios = new Privilegios(0, '', []);
    permisos: string[] = [];

    constructor(id: number, privilegio: Privilegios, permisos: string[]) {
        this.id = id;
        this.privilegio = privilegio;
        this.permisos = permisos;
    }
}