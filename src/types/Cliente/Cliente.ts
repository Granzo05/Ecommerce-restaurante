import { Domicilio } from "../Domicilio/Domicilio";
import { Pedido } from "../Pedidos/Pedido";

export class Cliente {
    id: number = 0;
    nombre: string = '';
    email: string = '';
    contraseña: string = '';
    domicilio: Domicilio[] | null = [];
    telefono: number = 0;
    privilegios: string = '';
    pedidos: Pedido[] = [];

    constructor(){

    }
}