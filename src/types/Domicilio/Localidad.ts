import { Departamento } from "./Departamento";
import { Domicilio } from "./Domicilio";

export class Localidad {
    id: number = 0;
    nombre: string = '';
    domicilios: Domicilio[] = [];
    departamento: Departamento | null = null;

    constructor(){

    }
}