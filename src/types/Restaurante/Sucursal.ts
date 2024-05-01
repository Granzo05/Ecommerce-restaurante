import { Domicilio } from "../Domicilio/Domicilio";
import { Empleado } from "./Empleado";

export class Sucursal {
    id: number = 0;
    domicilio: Domicilio | null = null;
    contraseña: string = '';
    telefono: number = 0;
    email: string = '';
    privilegios: string = '';
    horarioApertura: Date | null = null;
    horarioCierre: Date | null = null;
    empleados: Empleado[] = [];

    constructor() {

    }
}