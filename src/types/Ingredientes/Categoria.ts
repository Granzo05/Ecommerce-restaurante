import { Imagenes } from "../Productos/Imagenes";
import { Subcategoria } from "./Subcategoria";

export class Categoria {
    id: number = 0;
    nombre: string = '';
    borrado: string = '';
    subcategorias: Subcategoria[] = [];
    imagenes: Imagenes[] = [];

    constructor() {
    }
}