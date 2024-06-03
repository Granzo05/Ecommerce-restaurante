import { Factura } from '../types/Factura/Factura'
import { Pedido } from '../types/Pedidos/Pedido';
import { URL_API } from '../utils/global_variables/const';

export const FacturaService = {

    crearFactura: async (pedido: Pedido) => {
        console.log(pedido)
        try {
            const response = await fetch(URL_API + 'factura/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedido)
            })

            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getBill: async (userId: number): Promise<Factura[]> => {
        try {
            const response = await fetch(URL_API + `facturas/cliente/${userId}`, {
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


    getPDFBill: async (orderId: number): Promise<Uint8Array> => {
        // Hacemos la peticion del pdf
        const response = await fetch(`/ api / pdf / bill / ${orderId} / pdf`);
        // La llamada devuelve un array de bytes, los cuales transformamos para que pueda ser leído
        const byteArray = await response.arrayBuffer();
        return new Uint8Array(byteArray);
    }
}