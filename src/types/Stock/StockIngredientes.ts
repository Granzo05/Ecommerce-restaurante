import { Ingrediente } from "../Ingredientes/Ingrediente";
import { Stock } from "./Stock";

export class StockIngredientes extends Stock {
    id: number = 0;
    ingrediente: Ingrediente | null = null;
    borrado: string = '';

    constructor() {
        super();
    }
}