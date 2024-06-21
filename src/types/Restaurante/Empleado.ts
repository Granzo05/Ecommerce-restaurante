import { Domicilio } from "../Domicilio/Domicilio";
import { PrivilegiosEmpleados } from "./PrivilegiosEmpleado";
import { FechaContratacionEmpleado } from "./FechaContratacionEmpleado";
import { RolesEmpleado } from "./RolesEmpleados";
import { Sucursal } from "./Sucursal";
import { Imagenes } from "../Productos/Imagenes";

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
    privilegios: PrivilegiosEmpleados[] = [];
    sucursales: Sucursal[] = [];
    rolesEmpleado: RolesEmpleado[] = [];
    borrado: string = '';
    imagenes: Imagenes[] = [];
    
    constructor() {

    }
}