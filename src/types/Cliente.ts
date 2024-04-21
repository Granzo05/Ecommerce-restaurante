import { Pedido } from "./Pedido";

export class Cliente {
    fechaRegistro: Date = new Date();
    id: number = 0;
    nombre: string = '';
    email: string = '';
    domicilio: string = '';
    telefono: number = 0;
    contraseña: string = '';
    privilegios: string = '';
    pedidos: Pedido[] = [];

    constructor(){

    }
}