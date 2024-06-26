import { Articulo } from "./Articulo";
import { IngredienteMenu } from "../Ingredientes/IngredienteMenu";
import { Categoria } from "../Ingredientes/Categoria";
import { Subcategoria } from "../Ingredientes/Subcategoria";
import { Sucursal } from "../Restaurante/Sucursal";

export class ArticuloMenu extends Articulo{
    id: number = 0;
    nombre: string = '';
    tiempoCoccion: number = 0;
    categoria: Categoria = new Categoria();
    subcategoria: Subcategoria = new Subcategoria();
    comensales: number = 0;
    descripcion: string = '';
    ingredientesMenu: IngredienteMenu[] = [];
    sucursales: Sucursal[] = [];
    ganancia: number = 0;

    constructor() {
        super();
    }
}