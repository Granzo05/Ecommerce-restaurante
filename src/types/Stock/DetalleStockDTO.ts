import { EnumMedida } from "../Ingredientes/EnumMedida";

export class DetalleStockDTO {
    id: number = 0;
    cantidad: number = 0;
    costoUnitario: number = 0;
    subTotal: number = 0;
    medida: EnumMedida | null = null;
    ingredienteNombre: string = '';
    articuloVentaNombre: string = '';
    borrado: string = '';

    constructor() {

    }
}