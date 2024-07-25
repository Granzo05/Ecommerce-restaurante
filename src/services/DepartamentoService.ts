import { Departamento } from '../types/Domicilio/Departamento';

export const DepartamentoService = {
    getDepartamentos: async (): Promise<Departamento[] | null> => {
        try {
            const response = await fetch(process.env.URL_API + `departamentos`, {
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

    getDepartamentosByNombreProvincia: async (nombreProvincia: string): Promise<Departamento[] | []> => {
        try {
            const response = await fetch(process.env.URL_API + `departamentos/${nombreProvincia}`, {
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

}