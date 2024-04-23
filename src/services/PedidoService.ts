import { Cliente } from '../types/Cliente';
import { Pedido } from '../types/Pedido'
import { URL_API } from '../utils/global_variables/const';
import { FacturaService } from './FacturaService';

export const PedidoService = {
    getPedidosClientes: async (): Promise<Pedido[] | null> => {
        const clienteString = localStorage.getItem('usuario');
        let cliente: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();
        console.log(cliente);
        if (!cliente) {
            window.location.href = '/acceso-denegado';
        } else {
            try {
                const response = await fetch(URL_API + `cliente/${cliente.id}/pedidos`, {
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
        }

        return null;
    },

    getPedidos: async (estado: string): Promise<Pedido[]> => {
        try {
            const response = await fetch(URL_API + 'pedidos/' + estado, {
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

    updateEstadoPedido: async (pedido: Pedido, estado: string): Promise<string> => {
        pedido.estado = estado;

        // La factura solo se crea cuando el producto esta para entregar
        if (pedido.estado.match('entregados')) {
            pedido = await FacturaService.crearFactura(pedido);
            console.log(pedido);
        }
        
        try {
            const response = await fetch(URL_API + 'pedido/update/estado', {
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

}