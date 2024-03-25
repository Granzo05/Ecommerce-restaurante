import { Pedido, Cliente, Detalle } from "./types";
export function cargarPedidos(idRestaurante: number) {
    fetch('http://localhost:8080/restaurante/id/' + idRestaurante + "/pedidos/entrantes", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            let contenedorPrincipal = document.getElementById("pedidos");
            let menus: string[];

            data.forEach((pedido: Pedido) => {
                let contenedor = document.createElement("div");
                contenedor.className = "grid-item";

                let tipoEnvio = document.createElement("h3");
                tipoEnvio.textContent = pedido.tipoEnvio;
                contenedor.appendChild(tipoEnvio);

                // Si hubo envido el domicilio deberia estar, si fue retiro en tienda no
                if (pedido.domicilio != null) {
                    let domicilio = document.createElement("h3");
                    domicilio.textContent = pedido.domicilio;
                    contenedor.appendChild(domicilio);
                }


                pedido.detalles.forEach((detalle: Detalle) => {
                    let menu = document.createElement("p");
                    menu.textContent = detalle.menu;
                    contenedor.appendChild(menu);
                    // Obtengo todos los menus para validar mas adelante
                    menus.push(detalle.menu)

                    let cantidad = document.createElement("p");
                    cantidad.textContent = detalle.cantidad;
                    contenedor.appendChild(cantidad);
                });

                // Validar stock para ver si los ingredientes alcanzan para el pedido

                fetch('http://localhost:8080/restaurante/id/' + idRestaurante + '/stock/check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(menus)
                })
                    .then(response => {
                        if (!response.ok) {
                            alert(`El stock actual es insuficiente para los menus solicitados`);
                        }
                    })
                    .then(data => {
                        let buttonAceptar = document.createElement("button");
                        buttonAceptar.onclick = function () {
                            aceptarPedido(pedido.id, idRestaurante, pedido.cliente.email);
                        }

                        let buttonRechazar = document.createElement("button");
                        buttonRechazar.onclick = function () {
                            // Validar que haya un motivo
                            let motivoRechazo = document.createElement("input");

                            rechazarPedido(pedido.id, pedido.cliente.email, motivoRechazo.value);
                        }
                        if (contenedorPrincipal) {
                            contenedorPrincipal.appendChild(contenedor);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });


            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "pediloyaContact@gmail.com",
        pass: 'pediloya123456789'
    }
});

export function aceptarPedido(idPedido: number, idRestaurante: number, emailCliente: string) {
    let formData = {
        restaurante: idRestaurante,
        estadoPedido: "aceptado"
    }

    fetch('http://localhost:8080/pedido/update/' + idPedido, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }
            enviarCorreoExitoso(emailCliente);
            fetch('http://localhost:8080/pedido/update/' + idPedido, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
                    }
                    enviarCorreoExitoso(emailCliente);

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para rechazar el pedido
export function rechazarPedido(idPedido: number, emailCliente: string, motivoRechazo: string) {
    enviarCorreoRechazo(emailCliente, motivoRechazo);

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
}

// Función para enviar un correo electrónico de rechazo
export function enviarCorreoRechazo(emailCliente: string, motivoRechazo: string) {
    const mailOptions = {
        from: "pediloyaContact@gmail.com",
        to: emailCliente,
        subject: 'Rechazo de Pedido',
        text: `Lamentablemente, su pedido ha sido rechazado. \nMotivo: ${motivoRechazo}`
    };

    transporter.sendMail(mailOptions, (error: Error, info: string) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado: ' + info);
        }
    });
}

// Función para enviar un correo electrónico de rechazo
export function enviarCorreoExitoso(emailCliente: string) {
    const mailOptions = {
        from: "pediloyaContact@gmail.com",
        to: emailCliente,
        subject: 'Pedido aceptado',
        text: `El restaurante aceptó el pedido`
    };

    transporter.sendMail(mailOptions, (error: Error, info: string) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado: ' + info);
        }
    });
}

