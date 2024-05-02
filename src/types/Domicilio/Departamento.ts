import { Localidad } from "./Localidad";
import { Provincia } from "./Provincia";

export class Departamento {
    id: number = 0;
    nombre: string = '';
    localidades: Localidad[] = [];
    provincia: Provincia | null = null;

    constructor(){

    }
}