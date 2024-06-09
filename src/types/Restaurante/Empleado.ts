import { Domicilio } from "../Domicilio/Domicilio";
import { FechaContratacionEmpleado } from "./FechaContratacionEmpleado";
import { Sucursal } from "./Sucursal";

export class Empleado {
    id: number = 0;
    nombre: string = '';
    email: string = '';
    contraseña: string = '';
    cuil: string = '';
    telefono: number = 0;
    domicilios: Domicilio[] = [];
    fechaContratacion: FechaContratacionEmpleado[] = [];
    fechaNacimiento: Date = new Date();
    privilegios: string = '';
    sucursal: Sucursal | null = null;
    borrado: string = '';

    constructor() {

    }
}