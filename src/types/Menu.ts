import { IngredienteMenu } from "./IngredienteMenu";
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
    imagenes: File[] = [];

    constructor() {
    }
}