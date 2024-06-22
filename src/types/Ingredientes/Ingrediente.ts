import { Sucursal } from "../Restaurante/Sucursal";
import { StockIngredientes } from "../Stock/StockIngredientes";
import { Medida } from "./Medida";

export class Ingrediente {
    id: number = 0;
    nombre: string = '';
    medida: Medida = new Medida();
    borrado: string = '';
    stockIngrediente: StockIngredientes | null = null;
    sucursales: Sucursal[] = [];
    
    constructor() {
    }
}