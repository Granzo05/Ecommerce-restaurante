export class Privilegios {
    id: number = 0;
    nombre: string = '';
    borrado: string = '';

    constructor(id: number, nombre: string, borrado: string) {
        this.id = id;
        this.nombre = nombre;
        this.borrado = borrado;
    }
}