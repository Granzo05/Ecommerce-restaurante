import { Sucursal } from "../Restaurante/Sucursal";
import { DetalleStock } from "./DetalleStock";

export class StockEntrante {
    id: number = 0;
    fechaLlegada: Date | null = null;
    costo: number = 0;
    detallesStock: DetalleStock[] = [];
    sucursal: Sucursal | null = null;

    constructor() {

    }
}