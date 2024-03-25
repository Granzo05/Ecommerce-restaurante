import { Bill } from "./Bill";
import { Menu } from "./Menu";
import { Order } from "./Order";

export interface Detail {
    id: number;
    quantity: number;
    menu: Menu;
    order: Order;
    bill: Bill;
    subTotal: number;
}
