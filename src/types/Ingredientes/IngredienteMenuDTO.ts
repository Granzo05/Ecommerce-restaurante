import { EnumMedida } from "./EnumMedida";

export class IngredienteMenuDTO {
    id: number = 0;
    cantidad: number = 0;
    medida: EnumMedida | string = '';
    ingredienteNombre: string = '';

    constructor() {
    }
}