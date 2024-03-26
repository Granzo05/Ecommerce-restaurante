import { User } from '../types/User'
import { URL_API } from '../utils/global_variables/const';

export const UserService = {
    createUser: async (user: User): Promise<string> => {
        const response = await fetch(URL_API + 'user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        const data = await response.json();

        return data;
    },

    getUser: async (email: string, password: string): Promise<User> => {
        const response = await fetch(URL_API + 'user' + '/' + email + '/' + password)

        const data = await response.json();

        return data;
    },

    updateUser: async (user: User): Promise<string> => {
        const response = await fetch(URL_API + 'user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        const data = await response.json();

        return data;
    },

    deleteUser: async (user: User): Promise<string> => {
        const response = await fetch(URL_API + 'user/delete', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        const data = await response.json();

        return data;
    },
}