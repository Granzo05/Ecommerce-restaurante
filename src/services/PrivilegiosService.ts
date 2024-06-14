import { Privilegios } from '../types/Restaurante/Privilegios';
import { URL_API } from '../utils/global_variables/const';

export const PrivilegiosService = {
    getPrivilegios: async (): Promise<Privilegios[]> => {
        try {
            const response = await fetch(URL_API + 'privilegios', {
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
}