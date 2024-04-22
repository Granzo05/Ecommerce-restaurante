import { Pedido } from '../types/Pedido'
import { URL_API } from '../utils/global_variables/const';

export const PedidoService = {
    getPedidosClientes: async (userId: number): Promise<Pedido[]> => {
        try {
            const response = await fetch(URL_API + `/user/id/${userId}/orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            const data = await response.json();

            return data;


        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getPedidosNegocio: async (): Promise<Pedido[]> => {
        try {
            const response = await fetch('http://localhost:8080/restaurante/pedidos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            const data = await response.json();

            return data;


        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getPedidos: async (estado: string): Promise<Pedido[]> => {
        try {
            const response = await fetch('http://localhost:8080/pedidos/' + estado, {
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

    crearPedido: async (pedido: Pedido): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'pedido/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedido)
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


    eliminarPedido: async (pedido: Pedido): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'pedido/delete', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedido)
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

    /*
    aceptarPedido: async (idPedido: number, idRestaurante: number, emailCliente: string): Promise<string> => {
        let formData = {
            restaurante: idRestaurante,
            estadoPedido: "aceptado"
        }

        try {
            const response = await fetch('http://localhost:8080/pedido/update/' + idPedido, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            //enviarCorreoExitoso(emailCliente);

            return await response.text();


        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    },

    rechazarPedido: async (idPedido: number, motivoRechazo: string, emailCliente: string) => {
        //enviarCorreoRechazo(emailCliente, motivoRechazo);

        try {
            const response = await fetch('http://localhost:8080/pedido/delete/' + idPedido, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
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
*/

}