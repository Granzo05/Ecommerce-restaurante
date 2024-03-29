import { Pedido } from "./Pedido";
import { Cliente } from "./Cliente";

export interface Factura {
    id: number;
    tipo: string;
    metodoPago: string;
    pedido: Pedido;
    cliente: Cliente;
}