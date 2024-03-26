import { Order } from '../types/Order'
import { URL_API } from '../utils/global_variables/const';

export const UserService = {
    getOrdersClient: async (userId: number): Promise<Order[]> => {
        const response = await fetch(URL_API + `/user/id/${userId}/orders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const data = await response.json();

        return data;
    },

    getOrdersBusinness: async (): Promise<Order[]> => {
        const response = await fetch(URL_API + 'orders')

        const data = await response.json();

        return data;
    },

    getNewOrdersBusinness: async (): Promise<Order[]> => {
        const response = await fetch(URL_API + 'orders/incoming')

        const data = await response.json();

        return data;
    },

    createOrder: async (order: Order): Promise<string> => {
        const response = await fetch(URL_API + 'order/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })

        const data = await response.json();

        return data;
    },


    deleteOrder: async (order: Order): Promise<string> => {
        const response = await fetch(URL_API + 'order/delete', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })

        const data = await response.json();

        return data;
    },
}