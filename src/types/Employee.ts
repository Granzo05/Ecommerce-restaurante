import { Restaurant } from "./Restaurant";

export interface User {
    dateRegister: Date;
    id: number;
    name: string;
    last_name: string;
    cuit: number;
    phone: number;
    restaurant: Restaurant;
}