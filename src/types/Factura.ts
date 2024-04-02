import { Pedido } from "./Pedido";
import { Cliente } from "./Cliente";

export class Factura {
    id: number = 0;
    tipo: string = '';
    metodoPago: string = '';
    pedido: Pedido = new Pedido();
    cliente: Cliente = new Cliente();

    constructor(){
        
    }
}