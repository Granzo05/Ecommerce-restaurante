import { Medida } from '../types/Ingredientes/Medida';
import { sucursalId } from '../utils/global_variables/const';

export const MedidaService = {
    getMedidas: async (): Promise<Medida[]> => {
        try {
            const response = await fetch(process.env.URL_API + 'medidas/' + sucursalId(), {
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

    getMedidasNoBorradas: async (): Promise<Medida[]> => {
        try {
            const response = await fetch(process.env.URL_API + 'medidas/disponibles/' + sucursalId(), {
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

    createMedida: async (medida: Medida): Promise<string> => {
        try {
            const response = await fetch(process.env.URL_API + 'medida/create/' + sucursalId(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medida)
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

    updateMedida: async (medida: Medida): Promise<string> => {
        try {
            const response = await fetch(process.env.URL_API + 'medida/update/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medida)
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