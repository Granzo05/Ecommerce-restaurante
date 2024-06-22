import { Privilegios } from '../types/Restaurante/Privilegios';
import { PrivilegiosSucursales } from '../types/Restaurante/PrivilegiosSucursales';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const PrivilegiosService = {
    createPrivilegio: async (privilegio: PrivilegiosSucursales): Promise<string> => {
        try {
            const response = await fetch(URL_API + `privilegio/create/${sucursalId()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(privilegio)
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

    getPrivilegios: async (): Promise<PrivilegiosSucursales[]> => {
        try {
            const response = await fetch(URL_API + 'privilegios/' + sucursalId(), {
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

    updatePrivilegios: async (privilegio: Privilegios): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'privilegio/update/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(privilegio)
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