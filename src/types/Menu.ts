import { Ingredient } from "./Ingredient";
import { Multipart } from "./Multipart";
import { Restaurant } from "./Restaurant";

export interface Menu {
    id: number;
    coockingTime: number;
    type: string;
    diners: number;
    price: number;
    name: string;
    restaurant: Restaurant;
    ingredients: Ingredient[];
    imagen64: string;
    file: Multipart;
}