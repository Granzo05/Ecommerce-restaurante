import { DetalleStock } from "./DetalleStock";

export class StockEntranteDTO {
    id: number = 0;
    fechaLlegada: Date | null = null;
    costo: number = 0;
    detallesStock: DetalleStock[] = [];
    borrado: string = '';

    constructor() {

    }
}