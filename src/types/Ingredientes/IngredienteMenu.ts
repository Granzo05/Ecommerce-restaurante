import { Ingrediente } from "./Ingrediente";
import { ArticuloMenu } from "../Productos/ArticuloMenu";
import { EnumMedida } from "./EnumMedida";

export class IngredienteMenu {
    id: number = 0;
    cantidad: number = 0;
    medida: EnumMedida | string = '';
    ingrediente: Ingrediente | null = null;
    articuloMenu: ArticuloMenu | null = null;

    constructor() {
    }
}