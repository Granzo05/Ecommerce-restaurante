import { Cliente } from '../types/Cliente/Cliente'
import { Domicilio } from '../types/Domicilio/Domicilio';
import { URL_API } from '../utils/global_variables/const';

export const ClienteService = {
    createUser: async (cliente: Cliente) => {

        fetch(URL_API + 'cliente/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`)
                }
                return await response.json()
            })
            .then(data => {
                console.log(data)
                let cliente = {
                    id: data.id,
                    nombre: data.nombre,
                    email: data.email,
                    telefono: data.telefono,
                    idSucursalRecomendada: data.idSucursalRecomendada
                }
                localStorage.setItem('usuario', JSON.stringify(cliente));

                // Redirige al usuario al menú principal
                if (cliente.idSucursalRecomendada > 0) {
                    window.location.href = `/${cliente.idSucursalRecomendada}}`
                } else {
                    window.location.href = `/sucursales`
                }
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    //CONTRASEÑA OLVIDADA--------------------------------------------------//

    requestPasswordReset: async (email: string) => {
        const response = await fetch('/cliente/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Error al enviar la solicitud');
        }
    },

    //CONTRASEÑA OLVIDADA--------------------------------------------------//

    getUser: async (email: string, contraseña: string) => {
        fetch(URL_API + 'cliente/login/' + email + '/' + contraseña, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`)
                }
                return await response.json()
            })
            .then(data => {
                let cliente = {
                    id: data.id,
                    nombre: data.nombre,
                    email: data.email,
                    telefono: data.telefono,
                    idSucursalRecomendada: data.idSucursalRecomendada
                }
                localStorage.setItem('usuario', JSON.stringify(cliente));

                // Redirige al usuario al menú principal
                if (cliente.idSucursalRecomendada > 0) {
                    window.location.href = `/${cliente.idSucursalRecomendada}}`
                } else {
                    window.location.href = `/sucursales`
                }
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    getDomicilios: async (id: number): Promise<Domicilio[]> => {
        try {
            const response = await fetch(URL_API + `cliente/${id}/domicilios`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateUser: async (cliente: Cliente): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'cliente/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
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