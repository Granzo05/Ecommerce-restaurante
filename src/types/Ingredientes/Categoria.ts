import { Subcategoria } from "./Subcategoria";

export class Categoria {
    id: number = 0;
    denominacion: string = '';
    borrado: string = '';
    subcategorias: Subcategoria = new Subcategoria();
    
    constructor() {
    }
}