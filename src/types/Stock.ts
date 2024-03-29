import { Ingrediente } from "./Ingrediente";
import { Restaurante } from "./Restaurante";

export interface Stock {
    fechaIngreso: Date;
    id: number;
    cantidad: number;
    medida: string;
    restaurante: Restaurante;
    ingrediente: Ingrediente;
}