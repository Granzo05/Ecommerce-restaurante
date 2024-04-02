import { IngredienteMenu } from "./IngredienteMenu";
import { Multipart } from "./Multipart";
import { Restaurante } from "./Restaurante";

export class Menu {
    id: number = 0;
    tiempoCoccion: number = 0;
    tipo: string = '';
    comensales: number = 0;
    precio: number = 0;
    nombre: string = '';
    descripcion: string = '';
    restaurante: Restaurante | null = null;
    ingredientes: IngredienteMenu[] = [];
    imagen64: string = '';
    files: Multipart[] | null = null;

    constructor() {
    }
}