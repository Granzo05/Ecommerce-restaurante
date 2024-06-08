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

    getFactura: async (userId: number): Promise<Factura[]> => {
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


    getPdfFactura: async (idPedido: number) => {
        try {
            const response = await fetch(URL_API + `pdf/factura/${idPedido}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `factura_${idPedido}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    }
}