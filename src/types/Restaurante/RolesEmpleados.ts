import { Empleado } from "./Empleado";
import { Roles } from "./Roles";

export class RolesEmpleado {
    id: number = 0;
    rol: Roles = new Roles();
    empleado: Empleado = new Empleado();

    constructor() {
    }
}