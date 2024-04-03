import { Restaurante } from "./Restaurante";

export class Empleado {
    fechaIngreso: Date = new Date();
    id: number = 0;
    nombre: string = '';
    apellido: string = '';
    email:string = '';
    contraseña:string = '';
    cuit: number = 0;
    telefono: number = 0;
    restaurante: Restaurante = new Restaurante();

    constructor(){
        
    }
}