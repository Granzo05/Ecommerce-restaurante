import { Articulo } from "./Articulo";
import { Medida } from "../Ingredientes/Medida";
import { Categoria } from "../Ingredientes/Categoria";
import { Subcategoria } from "../Ingredientes/Subcategoria";
import { StockArticuloVenta } from "../Stock/StockArticuloVenta";
import { Sucursal } from "../Restaurante/Sucursal";

export class ArticuloVenta extends Articulo {
    id: number = 0;
    categoria: Categoria = new Categoria();
    subcategoria: Subcategoria = new Subcategoria();
    medida: Medida = new Medida();
    cantidadMedida: number = 0;
    stockArticuloVenta: StockArticuloVenta | null = null;
    sucursales: Sucursal[] = [];

    constructor() {
        super();
    }
}