import { IngredienteMenu } from "./IngredienteMenu";

export class Menu {
    id: number = 0;
    tiempoCoccion: number = 0;
    tipo: string = '';
    comensales: number = 0;
    precio: number = 0;
    nombre: string = '';
    descripcion: string = '';
    ingredientesMenu: IngredienteMenu[] = [];

    constructor() {
    }
}