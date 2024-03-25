import { Ingredient } from "./Ingredient";
import { Restaurant } from "./Restaurant";

export interface Stock {
    incomingDate: Date;
    id: number;
    quantity: number;
    measure: string;
    restaurant: Restaurant;
    ingredients: Ingredient;
}