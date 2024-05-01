import { Domicilio } from "../Domicilio/Domicilio";
import { Sucursal } from "./Sucursal";

export class Empleado {
    id: number = 0;
    nombre: string = '';
    email: string = '';
    contraseña: string = '';
    cuil: string = '';
    telefono: number = 0;
    domicilios: Domicilio[] = [];
    fechaContratacion: Date | null = null;
    fechaNacimiento: Date | null = null;
    privilegios: string = '';
    sucursal: Sucursal | null = null;

    constructor() {

    }
}