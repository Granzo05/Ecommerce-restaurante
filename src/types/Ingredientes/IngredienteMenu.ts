import { Ingrediente } from "./Ingrediente";
import { ArticuloMenu } from "../Productos/ArticuloMenu";
import { Medida } from "./Medida";

export class IngredienteMenu {
    id: number = 0;
    cantidad: number = 0;
    medida: Medida = new Medida();
    ingrediente: Ingrediente = new Ingrediente();
    articuloMenu: ArticuloMenu = new ArticuloMenu();
    borrado: string = '';

    constructor() {
    }
}