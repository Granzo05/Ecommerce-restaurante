import { Ingrediente } from "../Ingredientes/Ingrediente";
import { Medida } from "../Ingredientes/Medida";
import { ArticuloVenta } from "../Productos/ArticuloVenta";

export class DetalleStock {
    id: number = 0;
    cantidad: number = 0;
    costoUnitario: number = 0;
    medida: Medida = new Medida();
    ingrediente: Ingrediente = new Ingrediente();
    articuloVenta: ArticuloVenta = new ArticuloVenta();
    borrado: string = '';
    modificarPrecio: boolean = false;

    constructor() {

    }
}