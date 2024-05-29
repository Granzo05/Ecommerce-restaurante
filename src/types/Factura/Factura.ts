import { EnumMetodoPago } from "./EnumMetodoPago";
import { EnumTipoFactura } from "./EnumTipoFactura";
import { Pedido } from "../Pedidos/Pedido";

export class Factura {
    id: number = 0;
    tipoFactura: EnumTipoFactura | null = null;
    metodoPago: EnumMetodoPago | null = null;
    fechaFacturacion: Date = new Date();
    total: number = 0;
    pedido: Pedido = new Pedido();

    constructor() {

    }
}