import { StockIngredientes } from "../Stock/StockIngredientes";
import { EnumMedida } from "./EnumMedida";

export class Ingrediente {
    id: number = 0;
    nombre: string = '';
    stock: StockIngredientes | null = null;
    medida: EnumMedida | string = '';
    
    constructor() {
    }
}