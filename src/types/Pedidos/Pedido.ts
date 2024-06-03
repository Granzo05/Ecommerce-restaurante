import { Factura } from "../Factura/Factura";
import { Cliente } from "../Cliente/Cliente";
import { EnumTipoEnvio } from "./EnumTipoEnvio";
import { EnumEstadoPedido } from "./EnumEstadoPedido";
import { DetallesPedido } from "./Detalles_pedido";
import { Domicilio } from "../Domicilio/Domicilio";

export class Pedido {
    id: number = 0;
    tipoEnvio: EnumTipoEnvio | string = '';
    estado: EnumEstadoPedido = EnumEstadoPedido.ENTRANTES;
    fechaPedido: Date = new Date();
    horaFinalizacion: string = '';
    factura: Factura | null = null;
    cliente: Cliente = new Cliente();
    domicilioEntrega: Domicilio | null = null;
    detallesPedido: DetallesPedido[] = [];
    borrado: string = '';

    constructor() {

    }
}