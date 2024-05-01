import { Domicilio } from "./Domicilio";
import { Provincia } from "./Provincia";

export class Localidad {
    id: number = 0;
    nombre: string = '';
    domicilios: Domicilio[] = [];
    provincia: Provincia | null = null;

    constructor(){

    }
}