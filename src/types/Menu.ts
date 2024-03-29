import { Ingrediente } from "./Ingrediente";
import { Multipart } from "./Multipart";
import { Restaurante } from "./Restaurante";

export interface Menu {
    id: number;
    tiempoCoccion: number;
    tipo: string;
    comensales: number;
    precio: number;
    nombre: string;
    descripcion: string;
    restaurante: Restaurante;
    ingredientes: Ingrediente[];
    imagen64: string;
    file: Multipart;
}