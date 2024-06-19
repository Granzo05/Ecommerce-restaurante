import { Domicilio } from "../Domicilio/Domicilio";
import { EmpleadoPrivilegio } from "./PrivilegiosEmpleado";
import { FechaContratacionEmpleado } from "./FechaContratacionEmpleado";
import { RolesEmpleado } from "./RolesEmpleados";
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
    empleadoPrivilegios: EmpleadoPrivilegio[] = [];
    sucursales: Sucursal[] = [];
    rolesEmpleado: RolesEmpleado[] = [];
    borrado: string = '';

    constructor() {

    }
}