import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../assets/stylePedidos.module.css'
import { cargarPedidos } from '../js/pedidosRealizadosCliente'

const PedidosRealizados = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      cargarPedidos(id);
    }
  }, [id]);

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
