import { Domicilio } from "../Domicilio/Domicilio";
import { Categoria } from "../Ingredientes/Categoria";
import { ArticuloMenu } from "../Productos/ArticuloMenu";
import { ArticuloVenta } from "../Productos/ArticuloVenta";
import { Imagenes } from "../Productos/Imagenes";
import { Promocion } from "../Productos/Promocion";
import { LocalidadDelivery } from "./LocalidadDelivery";

export class Sucursal {
    id: number = 0;
    domicilio: Domicilio = new Domicilio();
    contraseña: string = '';
    telefono: number = 0;
    email: string = '';
    privilegios: string = '';
    horarioApertura: string = '';
    horarioCierre: string = '';
    localidadesDisponiblesDelivery: LocalidadDelivery[] = [];
    promociones: Promocion[] = [];
    articulosMenu: ArticuloMenu[] = [];
    articulosVenta: ArticuloVenta[] = [];
    categorias: Categoria[] = [];
    imagenes: Imagenes[] = [];
    borrado: string = '';

    constructor() {

    }
}