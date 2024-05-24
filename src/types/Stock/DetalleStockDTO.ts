import { Medida } from "../Ingredientes/Medida";

export class DetalleStockDTO {
    id: number = 0;
    cantidad: number = 0;
    costoUnitario: number = 0;
    subTotal: number = 0;
    medida: Medida = new Medida();
    ingredienteNombre: string = '';
    articuloVentaNombre: string = '';
    borrado: string = '';

    constructor() {

    }
}