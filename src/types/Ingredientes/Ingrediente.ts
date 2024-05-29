import { StockIngredientes } from "../Stock/StockIngredientes";
import { Medida } from "./Medida";

export class Ingrediente {
    id: number = 0;
    nombre: string = '';
    stock: StockIngredientes = new StockIngredientes();
    medida: Medida = new Medida();
    borrado: string = '';
    
    constructor() {
    }
}