import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../assets/stylePedidos.module.css';
import { cargarPedidos } from '../js/cocina';

const Cocina = () => {
  const { id } = useParams<{ id: string }>(); 

  useEffect(() => {
    if (id) {
      cargarPedidos(id); 
    }
  }, [id]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pedidos entrantes</h1>
      <div id="pedidos"></div>
    </div>
  );
};

export default Cocina;
