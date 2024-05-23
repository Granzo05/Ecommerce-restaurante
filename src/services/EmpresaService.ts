import { Empresa } from '../types/Restaurante/Empresa';
import { URL_API } from '../utils/global_variables/const';

export const EmpresaService = {
    createRestaurant: async (empresa: Empresa): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'empresa/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empresa)
            })

            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }

            return response.text();

        } catch (error) {
            console.error('Error:', error);
            throw new Error('Credenciales inválidas');
        }
    },

    getEmpresa: async (email: string, contraseña: string): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'empresa/login/' + email + '/' + contraseña, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }

            const data = await response.json();

            if (data.id === null) {
                throw new Error('Credenciales inválidas');
            } else {
                let restaurante = {
                    id: data.id,
                    email: data.email,
                    telefono: data.telefono,
                    privilegios: data.privilegios
                }

                localStorage.setItem('usuario', JSON.stringify(restaurante));

                return 'Sesión iniciada correctamente';
            }
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Credenciales inválidas');
        }
    },



    getEmpresas: async (): Promise<Empresa[]> => {
        try {
            const response = await fetch(URL_API + 'empresas', {
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

    updateRestaurant: async (empresa: Empresa) => {
        try {
            const response = await fetch(URL_API + 'empresa/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empresa)
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

    deleteEmpresa: async (idEmpresa: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'empresa/' + idEmpresa + '/delete', {
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