import { Subcategoria } from "./Subcategoria";

export class Categoria {
    id: number = 0;
    nombre: string = '';
    borrado: string = '';
    subcategorias: Subcategoria = new Subcategoria();
    
    constructor() {
    }
}