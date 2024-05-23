import { Stock } from "./Stock";

export class StockArticuloVentaDTO extends Stock {
    id: number = 0;
    nombreArticulo: string = '';
    tipo: string = '';
    borrado: string = '';
    
    constructor() {
        super();
    }
}