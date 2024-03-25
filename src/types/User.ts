import { Bill } from "./Bill";
import { Order } from "./Order";

export interface User {
    dateRegister: Date;
    id: number;
    name: string;
    last_name: string;
    email: string;
    address: string;
    phone: number;
    password: string;
    bill: Bill;
    privilegies: string;
    orders: Order[];
}