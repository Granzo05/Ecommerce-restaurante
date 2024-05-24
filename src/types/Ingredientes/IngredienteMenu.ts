import { Ingrediente } from "./Ingrediente";
import { ArticuloMenu } from "../Productos/ArticuloMenu";
import { Medida } from "./Medida";

export class IngredienteMenu {
    id: number = 0;
    cantidad: number = 0;
    medida: Medida = new Medida();
    ingrediente: Ingrediente | null = null;
    articuloMenu: ArticuloMenu | null = null;
    borrado: string = '';

    constructor() {
    }
}