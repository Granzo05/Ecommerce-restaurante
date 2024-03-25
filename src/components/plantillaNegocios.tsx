import styles from '../assets/styleNegocio.module.css'
import {finalizarPedido, abrirModal, añadirCampoIngrediente, agregarMenu} from '../js/pedidos/ScriptPedido'


function PlantillaNegocios () {
  return (
    <div>
      <header>
        <div>
          <img src="" className="logo" />
        </div>

        <div>
          <h1 className={styles.nombreRestaurante}></h1>
        </div>

        <div className={styles.containerIcon}>
          <i className='bx bx-cart'></i>
          <div className={styles.contadorProductos}>
            <span id="contador">0</span>
          </div>
          <div id="carrito" className="container-productosCarrito hidden-cart">
            <img width="50" height="50" src="https://img.icons8.com/ios/50/multiply.png" alt="multiply" className="iconoCerrar" />
            <div id="tarjeta-carrito"></div>
            <div className={styles.totalCarrito}>
              <h3>Total:</h3>
              <span className={styles.totalPagar}></span>
            </div>
            <button onClick={finalizarPedido}>Finalizar pedido</button>
          </div>
        </div>
      </header>

      <button className="boton negocio" onClick={abrirModal}>Añadir menu</button>

      <div id="container-items">
      </div>

      <div id="miModal" className="modal">
        <div className="modal-content">
          <label>
            <i className='bx bx-image'></i>
            <input type="file" id="imagenProducto" accept="image/*" />
          </label>
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="Nombre del menu" id="nombreMenu" />
          </label>
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="Minutos de coccion" id="coccionMenu" />
          </label>
          <br />
          <label>
            <select id="tipoMenu" name="tipoMenu">
              <option value="ENTRADA">Entrada</option>
              <option value="DESAYUNO">Desayuno</option>
              <option value="MEDIATARDE">Merienda</option>
              <option value="MENU">Menú</option>
              <option value="BEBIDA_ALCOHOLICA">Bebida Alcohólica</option>
              <option value="BEBIDA_SIN_ALCOHOL">Bebida sin Alcohol</option>
            </select>
          </label>
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="¿Cuantas personas comen?" id="comensales" />
          </label>
          <br />
          <label id="ingrediente-containter">
            <input type="text" placeholder="Ingrediente" className="ingredienteMenu" />
            <input type="number" placeholder="Cantidad necesaria" className="cantidadIngrediente" />
          </label>
          <br />
          <button onClick={añadirCampoIngrediente}>Añadir ingrediente</button>
          <br />
          <label>
            <i className='bx bx-price'></i>
            <input type="number" placeholder="Precio" id="precioMenu" />
          </label>
          <br />
          <input type="button" value="agregarMenu" id="agregarMenu" onClick={agregarMenu} />
        </div>
      </div>
    </div>
  )
}

export default PlantillaNegocios
