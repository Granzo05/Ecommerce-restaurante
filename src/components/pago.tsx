import React from 'react'
import { enviarPedidoARestaurante, realizarPago } from '../js/pago';

const Pago = () => {
    return (
        <div>
            <header>
                <h1>Detalle de Compra</h1>
            </header>
            <div id="detalle-producto"></div>
            <select name="tipoEnvio" id="tipoEnvio">
                <option value="DELIVERY">Delivery</option>
                <option value="RETIRO">Retiro en tienda</option>
            </select>
            <h2>Detalles del domicilio</h2>
            <form>
                <label id="domicilio">Domicilio:</label>
                <input
                    type="text"
                    id="domicilioCliente"
                    name="domicilioCliente"
                    required
                    placeholder="Ingresa tu domicilio"
                    hidden
                />
            </form>
            <section className="informacion-pago">
                <button
                    type="submit"
                    onClick={() => enviarPedidoARestaurante('EFECTIVO')}
                    hidden
                    id="botonEncargo"
                >
                    Realizar encargo
                </button>
                <button
                    type="submit"
                    hidden
                    id="checkout-btn"
                    onClick={realizarPago}
                >
                    Pagar con MercadoPago
                </button>
            </section>
        </div>
    )
}

export default Pago
