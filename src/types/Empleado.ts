import { Restaurante } from "./Restaurante";

export interface Empleado {
    fechaEntrada: Date;
    id: number;
    nombre: string;
    apellido: string;
    email:string;
    contraseña:string;
    cuit: number;
    telefono: number;
    restaurante: Restaurante;
}