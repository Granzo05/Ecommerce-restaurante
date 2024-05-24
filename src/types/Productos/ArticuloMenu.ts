import { Articulo } from "./Articulo";
import { IngredienteMenu } from "../Ingredientes/IngredienteMenu";
import { Categoria } from "../Ingredientes/Categoria";

export class ArticuloMenu extends Articulo{
    id: number = 0;
    nombre: string = '';
    tiempoCoccion: number = 0;
    categoria: Categoria = new Categoria();
    comensales: number = 0;
    descripcion: string = '';
    ingredientesMenu: IngredienteMenu[] | null = [];

    constructor() {
        super();
    }
}