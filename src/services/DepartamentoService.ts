import { Departamento } from '../types/Domicilio/Departamento';
import { URL_API } from '../utils/global_variables/const';

export const DepartamentoService = {
    getDepartamentos: async (): Promise<Departamento[] | null> => {
        try {
            const response = await fetch(URL_API + `departamentos`, {
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

    getDepartamentosByNombreEqual: async (nombre: string): Promise<Departamento[] | null> => {
        try {
            const response = await fetch(URL_API + `departamentos/${nombre}`, {
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
            const response = await fetch(URL_API + `departamentos/${nombreProvincia}`, {
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

    getLocalidadByNombreAndProvinciaId: async (nombre: string, provinciaId: number): Promise<Departamento[] | null> => {
        try {
            const response = await fetch(URL_API + `departamentos/${nombre}/${provinciaId}`, {
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

    createDepartamentosByIdProvincia: async (idProvincia: number): Promise<Departamento[] | null> => {
        try {
            const response = await fetch(URL_API + `departamentos/create/${idProvincia}`, {
                method: 'POST',
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