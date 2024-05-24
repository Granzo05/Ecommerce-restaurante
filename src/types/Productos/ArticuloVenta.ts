import { Articulo } from "./Articulo";
import { Medida } from "../Ingredientes/Medida";
import { Categoria } from "../Ingredientes/Categoria";

export class ArticuloVenta extends Articulo {
    id: number = 0;
    categoria: Categoria = new Categoria();
    medida: Medida = new Medida();
    cantidadMedida: number = 0;

    constructor() {
        super();
    }
}