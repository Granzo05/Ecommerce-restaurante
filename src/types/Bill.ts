import { DetailOrder } from "./DetailOrder";
import { User } from "./User";

export interface Bill {
    id: number;
    date: Date;
    type: string;
    payMethod: string;
    detailsOrder: DetailOrder[];
    user: User;
    email: string;
    address: string;
    phone: number;
}