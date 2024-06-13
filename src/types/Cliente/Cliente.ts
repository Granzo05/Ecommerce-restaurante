import { Domicilio } from "../Domicilio/Domicilio";
import { Pedido } from "../Pedidos/Pedido";

export class Cliente {
    id: number = 0;
    nombre: string = '';
    email: string = '';
    contraseña: string = '';
    domicilios: Domicilio[] = [];
    fechaNacimiento: Date = new Date();
    telefono: number = 0;
    privilegios: string = '';
    pedidos: Pedido[] = [];
    borrado: string = '';
    idSucursal: number = 1;

    constructor(){

    }
}