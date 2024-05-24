import { Categoria } from "../Ingredientes/Categoria";
import { IngredienteMenu } from "../Ingredientes/IngredienteMenu";
import { IngredienteMenuDTO } from "../Ingredientes/IngredienteMenuDTO";
import { Articulo } from "./Articulo";

export class ArticuloMenuDTO extends Articulo {
    id: number = 0;
    nombre: string = '';
    tiempoCoccion: number = 0;
    categoria: Categoria = new Categoria();
    comensales: number = 0;
    descripcion: string = '';
    ingredientesMenu: IngredienteMenuDTO[] = [];
    ingredientes: IngredienteMenu[] = [];

    constructor() {
        super();
    }
}