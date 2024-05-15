import { IngredienteMenuDTO } from "../Ingredientes/IngredienteMenuDTO";
import { Articulo } from "./Articulo";
import { EnumTipoArticuloComida } from "./EnumTipoArticuloComida";

export class ArticuloMenuDTO extends Articulo {
    id: number = 0;
    nombre: string = '';
    tiempoCoccion: number = 0;
    tipo: EnumTipoArticuloComida | string = '';
    comensales: number = 0;
    descripcion: string = '';
    ingredientesMenu: IngredienteMenuDTO[] = [];

    constructor() {
        super();
    }
}