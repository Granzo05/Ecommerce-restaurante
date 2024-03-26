import { Restaurant } from '../types/Restaurant';
import { URL_API } from '../utils/global_variables/const';

export const UserService = {
    createRestaurant: async (restaurant: Restaurant): Promise<string> => {
        const response = await fetch(URL_API + 'restaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: JSON.stringify(restaurant)
        })

        const data = await response.json();

        return data;
    },

    getRestaurant: async (email: string, password: string): Promise<Restaurant> => {
        const response = await fetch(URL_API + `restaurant/login/${email}/${password}`)

        const data = await response.json();

        return data;
    },

    updateRestaurant: async (restaurant: Restaurant): Promise<Restaurant> => {
        const response = await fetch(URL_API + 'restaurant/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(restaurant)
        })

        const data = await response.json();

        return data;
    },
}