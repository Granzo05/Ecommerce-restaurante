import { Bill } from "./Bill";
import { Detail } from "./Detail";
import { Restaurant } from "./Restaurant";
import { User } from "./User";

export interface Order {
    id: number;
    typeShipment: string;
    user: User;
    restaurant: Restaurant;
    bill: Bill;
    address: string;
    status: string;
    phone: number;
    details: Detail[];
}