import { Domicilio } from "../Domicilio/Domicilio";
import { LocalidadDelivery } from "./LocalidadDelivery";

export class Sucursal {
    id: number = 0;
    domicilio: Domicilio | null = null;
    contraseña: string = '';
    telefono: number = 0;
    email: string = '';
    privilegios: string = '';
    horarioApertura: string = '';
    horarioCierre: string = '';
    localidadesDisponiblesDelivery: LocalidadDelivery[] | null = [];

    constructor() {

    }
}