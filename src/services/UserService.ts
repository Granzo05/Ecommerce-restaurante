const URL_API = 'http://localhost:8080/';
import { User } from '../types/User'

export const UserService = {

    getUser: async (email: string, password: string): Promise<User> => {
        const response = await fetch(URL_API + 'user' + '/' + email + '/' + password)

        const data = await response.json();

        return data;
    },

    createUser: async (user: User): Promise<string> => {
        const response = await fetch(URL_API + 'create-user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        const data = await response.json();

        return data;
    },

    updateUser: async (user: User): Promise<string> => {
        const response = await fetch(URL_API + 'update-user', {
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
        const response = await fetch(URL_API + 'delete-user', {
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