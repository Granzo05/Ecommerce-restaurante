import { Sucursal } from "../Restaurante/Sucursal";
import { DetalleStock } from "./DetalleStock";

export class StockEntrante {
    id: number = 0;
    fechaLlegada: Date = new Date();
    // String para parsearlo a formato de $ ars
    costo: string = '';
    detallesStock: DetalleStock[] = [];
    sucursal: Sucursal | null = null;
    borrado: string = '';

    constructor() {

    }
}