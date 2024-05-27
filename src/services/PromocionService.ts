import { Promocion } from '../types/Productos/Promocion';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const PromocionService = {
    createPromocion: async (promocion: Promocion): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'promocion/create/' + sucursalId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(promocion)
            })

            if (!response.ok) {
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw new Error('Credenciales inválidas');
        }
    },

    getPromociones: async (): Promise<Promocion[]> => {
        try {
            const response = await fetch(URL_API + 'promociones/' + sucursalId, {
                method: 'GET',
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

    updatePromocion: async (promocion: Promocion) => {
        try {
            const response = await fetch(URL_API + 'promocion/update/' + sucursalId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(promocion)
            })
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
}