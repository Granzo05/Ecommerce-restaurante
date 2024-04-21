import { Cliente } from "./Cliente";

export class Factura {
    id: number = 0;
    tipo: string = '';
    metodoPago: string = '';
    cliente: Cliente = new Cliente();

    constructor(){
        
    }
}