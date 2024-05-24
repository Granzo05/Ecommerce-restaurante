import { Medida } from "./Medida";

export class IngredienteMenuDTO {
    id: number = 0;
    cantidad: number = 0;
    medida: Medida = new Medida();
    ingredienteNombre: string = '';

    constructor() {
    }
}