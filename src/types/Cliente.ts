import { Factura } from "./Factura";
import { Pedido } from "./Pedido";

export interface Cliente {
    fechaRegistro: Date;
    id: number;
    nombre: string;
    email: string;
    domicilio: string;
    telefono: number;
    contraseña: string;
    factura: Factura;
    privilegios: string;
    pedidos: Pedido[];
}