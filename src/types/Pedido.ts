import { Factura } from "./Factura";
import { DetallePedido } from "./Detalles_pedido";
import { Cliente } from "./Cliente";

export class Pedido {
    id: number = 0;
    tipoEnvio: string = '';
    cliente: Cliente = new Cliente;
    //restaurante: Restaurante = new Restaurante();
    factura: Factura | null = null;
    estado: string = '';
    detalles: DetallePedido[] = [];

    constructor() {

    }
}