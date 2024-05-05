import { Domicilio } from "../Domicilio/Domicilio";
import { Localidad } from "../Domicilio/Localidad";

export class Sucursal {
    id: number = 0;
    domicilio: Domicilio | null = null;
    contraseña: string = '';
    telefono: number = 0;
    email: string = '';
    privilegios: string = '';
    horarioApertura: string = '';
    horarioCierre: string = '';
    localidadesDisponiblesDelivery: Localidad[] = [];

    constructor() {

    }
}