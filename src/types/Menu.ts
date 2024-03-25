import { Ingredient } from "./Ingredient";
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
}