import { Domicilio } from "../Domicilio/Domicilio";
import { Categoria } from "../Ingredientes/Categoria";
import { Imagenes } from "../Productos/Imagenes";
import { Promocion } from "../Productos/Promocion";
import { LocalidadDelivery } from "./LocalidadDelivery";

export class SucursalDTO {
    id: number = 0;
    domicilio: Domicilio = new Domicilio();
    nombre: string = '';
    telefono: number = 0;
    email: string = '';
    horarioApertura: string = '';
    horarioCierre: string = '';
    localidadesDisponiblesDelivery: LocalidadDelivery[] = [];
    promociones: Promocion[] = [];
    categorias: Categoria[] = [];
    imagenes: Imagenes[] = [];
    borrado: string = '';

    constructor() {

    }
}