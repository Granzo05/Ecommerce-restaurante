import { Domicilio } from "../Domicilio/Domicilio";

export class ClienteDTO {
    id: number = 0;
    nombre: string = '';
    email: string = '';
    domicilios: Domicilio[] = [];
    telefono: number = 0;

    constructor(){
    }
}