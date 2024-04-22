import { URL_API } from "../utils/global_variables/const";

export function descargarFactura(idPedido: number, fechaPedido: string) {
    fetch(URL_API + "factura/pedido/" + idPedido + "/pdf", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }
            return response.blob();
        })
        .then(blob => {
            // Blob y un enlace para descargar el PDF
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "factura" + fechaPedido + ".pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); // Liberar la URL del objeto Blob
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

export function descargarPedido(idPedido: number, fechaPedido: string) {
    fetch(URL_API+ "pedido/" + idPedido + "/pdf", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }
            return response.blob();
        })
        .then(blob => {
            // Blob y un enlace para descargar el PDF
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "factura" + fechaPedido + ".pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); // Liberar la URL del objeto Blob
        })
        .catch(error => {
            console.error("Error:", error);
        });
}