import { StockIngredientes } from "../Stock/StockIngredientes";
import { Medida } from "./Medida";

export class Ingrediente {
    id: number = 0;
    nombre: string = '';
    stock: StockIngredientes | null = null;
    medida: Medida = new Medida();
    borrado: string = '';
    
    constructor() {
    }
}