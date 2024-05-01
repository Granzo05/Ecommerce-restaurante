import { ArticuloVenta } from "../Productos/ArticuloVenta";
import { FechaStock } from "./DetalleStock";
import { Stock } from "./Stock";

export class StockArticuloVenta extends Stock {
    id: number = 0;
    articuloVenta: ArticuloVenta | null = null;
    fechaIngreso: FechaStock[] = [];

    constructor() {
        super();
    }
}