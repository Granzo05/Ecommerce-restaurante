import { Medida } from "./Medida";

export class Ingrediente {
    id: number = 0;
    nombre: string = '';
    medida: Medida = new Medida();
    borrado: string = '';
    
    constructor() {
    }
}