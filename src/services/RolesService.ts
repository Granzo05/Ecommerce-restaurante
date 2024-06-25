import { Roles } from '../types/Restaurante/Roles';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const RolesService = {
    createRol: async (rol: Roles): Promise<string> => {
        try {
            const response = await fetch(URL_API + `roles/create/${sucursalId()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rol)
            })
            if (!response.ok) {
                throw new Error(await response.text());
            }

            return await response.text();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getRoles: async (): Promise<Roles[]> => {
        try {
            const response = await fetch(URL_API + 'roles/' + sucursalId(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
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

    getRolesNoBorrados: async (): Promise<Roles[]> => {
        try {
            const response = await fetch(URL_API + 'roles/disponibles/' + sucursalId(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
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

    updateRol: async (rol: Roles): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'rol/update/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rol)
            })
            if (!response.ok) {
                throw new Error(await response.text());
            }

            return await response.text();


        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
}