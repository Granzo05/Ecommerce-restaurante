import { Cliente } from '../types/Cliente/Cliente'
import { Domicilio } from '../types/Domicilio/Domicilio';
import { EnumEstadoPedido } from '../types/Pedidos/EnumEstadoPedido';
import { Pedido } from '../types/Pedidos/Pedido';
import { limpiarCredenciales, URL_API } from '../utils/global_variables/const';

export const ClienteService = {
    createUser: async (cliente: Cliente) => {
        limpiarCredenciales();
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

    getUser: async (email: string, contraseña: string): Promise<string> => {
        limpiarCredenciales();
        try {
            const response = await fetch(URL_API + 'cliente/login/' + email + '/' + contraseña, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`)
            }

            const data = await response.json();

            if (data.id != null || data.id > 0) {
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
            }

            return 'Los datos ingresados no corresponden a una cuenta activa';


        } catch (error) {
            throw new Error('Los datos ingresados no corresponden a una cuenta activa');
        }
    },

    getUserByEmail: async (email: string): Promise<boolean> => {
        limpiarCredenciales();
        try {
            const response = await fetch(URL_API + 'cliente/email/' + email, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`)
            }

            const data = await response.json();
            console.log(data)

            if (data.id != null && data.id > 0) {
                console.log('retorna true')
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
                return true;
            } else {
                return false;
            }


        } catch (error) {
            throw new Error('Los datos ingresados no corresponden a una cuenta activa');
        }
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

    getPedidos: async (estado: EnumEstadoPedido): Promise<Pedido[]> => {
        const usuarioString = localStorage.getItem('usuario');

        if (usuarioString) {
            const usuario: Cliente = JSON.parse(usuarioString);

            try {
                const response = await fetch(URL_API + `cliente/${usuario.id}/pedidos/${estado}`, {
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
        } else {
            return [];
        }
    },

    getPedidosPorOtrosEstados: async (estado: EnumEstadoPedido): Promise<Pedido[]> => {
        const usuarioString = localStorage.getItem('usuario');

        if (usuarioString) {
            const usuario: Cliente = JSON.parse(usuarioString);

            try {
                const response = await fetch(URL_API + `cliente/${usuario.id}/pedidos/distintos/${estado}`, {
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
        } else {
            return [];
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