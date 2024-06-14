export class Privilegios {
    id: number = 0;
    tarea: string = '';
    permisos: string[] = [];

    constructor(id: number, tarea: string, permisos: string[]) {
        this.id = id;
        this.tarea = tarea;
        this.permisos = permisos;
    }
}