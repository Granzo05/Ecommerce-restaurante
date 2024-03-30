import styles from '../assets/stylePedidos.module.css'
import { ClienteService } from '../services/ClienteService'

const PedidosRealizados = () => {
  ClienteService.checkUser();

  /*
  .then(data => {
  let contenedorPrincipal = document.getElementById("pedidos");
  let menus: Menu[];

  data.forEach((pedido: Pedido) => {
    let contenedor = document.createElement("div");
    contenedor.className = "grid-item";

    let tipoEnvio = document.createElement("h3");
    tipoEnvio.textContent = pedido.tipoEnvio;
    contenedor.appendChild(tipoEnvio);

    // Si hubo envido el domicilio deberia estar, si fue retiro en tienda no
    if (pedido.cliente.domicilio != null) {
      let domicilio = document.createElement("h3");
      domicilio.textContent = pedido.cliente.domicilio;
      contenedor.appendChild(domicilio);
    }


    pedido.detalles.forEach((detalle: DetallePedido) => {
      let menu = document.createElement("p");
      menu.textContent = detalle.menu.nombre;
      contenedor.appendChild(menu);
      // Obtengo todos los menus para validar mas adelante
      menus.push(detalle.menu)

      let cantidad = document.createElement("p");
      cantidad.textContent = detalle.cantidad.toString();
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
  */
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tus Pedidos</h1>
      <div className={styles.filter}>
        <form> //Todo: agregar manejo de carga del formulario
          <label htmlFor="diaInicio">Fecha de inicio:</label>
          <input type="date" id="diaInicio" name="diaInicio" required />

          <label htmlFor="diaFin">Fecha de fin:</label>
          <input type="date" id="diaFin" name="diaFin" required />

          <input type="submit" value="Filtrar" />
        </form>
      </div>
      <div id="pedidos"></div>
    </div>
  )
}

export default PedidosRealizados
