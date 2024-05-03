import { Sucursal } from '../types/Restaurante/Sucursal';
import { URL_API } from '../utils/global_variables/const';

export const SucursalService = {
    createRestaurant: async (sucursal: Sucursal) => {
        // Creamos el restaurante en la db
        await fetch(URL_API + 'restaurante/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sucursal)
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error(await response.text())
                }
                return await response.json()
            })
            .then(data => {
                let restaurante = {
                    id: data.id,
                    email: data.email,
                    telefono: data.telefono,
                    privilegios: data.privilegios
                }
                localStorage.setItem('usuario', JSON.stringify(restaurante));

                // Redirige al usuario al menú principal
                window.location.href = '/'
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    getSucursal: async (email: string, contraseña: string) => {
        await fetch(URL_API + 'restaurant/login/' + email + '/' + contraseña, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Usuario existente')
                }

                return await response.json()
            })
            .then(data => {
                let restaurante = {
                    id: data.id,
                    email: data.email,
                    telefono: data.telefono,
                    privilegios: data.privilegios
                }

                localStorage.setItem('usuario', JSON.stringify(restaurante));

                // Redirige al usuario al menú principal
                window.location.href = '/'
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    getSucursales: async (): Promise<Sucursal[]> => {
        try {
            const response = await fetch(URL_API + 'sucursales', {

                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateRestaurant: async (restaurante: Sucursal): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'restaurant/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(restaurante)
            })
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            return await response.json();


        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    deleteSucursal: async (idSucursal: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'sucursal/' + idSucursal + '/delete', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return await response.text();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
}