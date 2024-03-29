import { Factura } from "./Factura";
import { Menu } from "./Menu";
import { Pedido } from "./Pedido";

export interface DetallePedido {
    id: number;
    cantidad: number;
    menu: Menu;
    pedido: Pedido;
    factura: Factura;
    subTotal: number;
}
