import { DetalleStock } from "./DetalleStock";

export class StockEntrante {
    id: number = 0;
    fechaLlegada: Date | null = null;
    detallesStock: DetalleStock[] = [];

    constructor() {

    }
}