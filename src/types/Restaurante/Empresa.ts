import { Sucursal } from "./Sucursal";

export class Empresa {
    id: number = 0;
    cuit: number = 0;
    razonSocial: string = '';
    sucursales: Sucursal[] = [];

    constructor(){}
}