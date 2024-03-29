import { Factura } from "./Factura";
import { DetallePedido } from "./Detalles_pedido";
import { Restaurante } from "./Restaurante";
import { Cliente } from "./Cliente";

export interface Pedido {
    id: number;
    tipoEnvio: string;
    cliente: Cliente;
    restaurante: Restaurante;
    factura: Factura;
    direccion: string;
    estado: string;
    telefono: number;
    detalles: DetallePedido[];
}