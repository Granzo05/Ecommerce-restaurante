import { Factura } from "../Factura/Factura";
import { Cliente } from "../Cliente/Cliente";
import { EnumTipoEnvio } from "./EnumTipoEnvio";
import { EnumEstadoPedido } from "./EnumEstadoPedido";
import { DetallesPedido } from "./Detalles_pedido";
import { Domicilio } from "../Domicilio/Domicilio";

export class Pedido {
    id: number = 0;
    tipoEnvio: EnumTipoEnvio | null = null;
    estado: EnumEstadoPedido | null = null;
    fechaPedido: Date | null = null;
    horaFinalizacion: string = '';
    factura: Factura | null = null;
    cliente: Cliente | null = null;
    domicilioEnvio: Domicilio | null = null;
    detallesPedido: DetallesPedido[] = [];

    constructor() {

    }
}