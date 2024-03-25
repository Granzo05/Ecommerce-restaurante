import { descargarFactura } from './pdfs/scriptDescargaPDF'
import { Pedido } from './types'

export function cargarPedidos(idRestaurante: string) {
  fetch('http://localhost:8080/restaurante/id/' + idRestaurante + '/cocina', {
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
      const gridContainer = document.getElementById('pedidos')

      data.forEach((pedido: Pedido) => {
        const gridItem = document.createElement('div')
        gridItem.className = 'gridItem'

        const tipoEnvio = document.createElement('h3')
        tipoEnvio.textContent = pedido.tipoEnvio
        gridItem.appendChild(tipoEnvio)

        // Si hubo envido el domicilio deberia estar, si fue retiro en tienda no
        if (pedido.domicilio != null) {
          const domicilio = document.createElement('h3')
          domicilio.textContent = pedido.domicilio
          gridItem.appendChild(domicilio)
        }


        pedido.detalles.forEach(detalle => {
          const menu = document.createElement('p')
          menu.textContent = detalle.menu
          gridItem.appendChild(menu)

          const cantidad = document.createElement('p')
          cantidad.textContent = detalle.cantidad
          gridItem.appendChild(cantidad)

        
        })

        const fecha = document.createElement('h2')
        fecha.textContent = pedido.detalles[0].fechaPedido
        gridItem.appendChild(fecha)

        const facturaButton = document.createElement('button')
        facturaButton.textContent = 'DESCARGAR FACTURA'

        facturaButton.onclick = function () {
          if (fecha.textContent) {
            descargarFactura(pedido.id, fecha.textContent)
          }
        }

        if (gridContainer) {
          gridContainer.appendChild(gridItem)
        }
      })
    })
    .catch(error => {
      console.error('Error:', error)
    })
}
