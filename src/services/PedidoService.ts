import { Pedido } from '../types/Pedido'
import { URL_API } from '../utils/global_variables/const';

export const PedidoService = {
    getPedidosClientes: async (userId: number): Promise<Pedido[]> => {
        const response = await fetch(URL_API + `/user/id/${userId}/orders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const data = await response.json();

        return data;
    },

    getPedidosNegocio: async (): Promise<Pedido[]> => {
        const response = await fetch('http://localhost:8080/restaurante/pedidos', {
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
            .catch(error => {
                console.error('Error:', error)
            })

        const data = await response.json();

        return data;
    },

    getPedidos: async (estado: string): Promise<Pedido[]> => {
        const response = await fetch('http://localhost:8080/restaurante/pedidos/' + estado, {
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
            .catch(error => {
                console.error('Error:', error)
            })

        const data = await response.json();

        return data;
    },

    crearPedido: async (pedido: Pedido): Promise<string> => {
        const response = await fetch(URL_API + 'pedido/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        })

        return await response.text();

    },


    eliminarPedido: async (pedido: Pedido): Promise<string> => {
        const response = await fetch(URL_API + 'pedido/delete', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        })

        return await response.text();

    },

    aceptarPedido: async (idPedido: number, idRestaurante: number, emailCliente: string): Promise<string> => {
        let formData = {
            restaurante: idRestaurante,
            estadoPedido: "aceptado"
        }

        const response = await fetch('http://localhost:8080/pedido/update/' + idPedido, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        //enviarCorreoExitoso(emailCliente);

        return await response.text();

    },

    rechazarPedido: async (idPedido: number, motivoRechazo: string, emailCliente: string)=> {
        //enviarCorreoRechazo(emailCliente, motivoRechazo);

        fetch('http://localhost:8080/pedido/delete/' + idPedido, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    },


}