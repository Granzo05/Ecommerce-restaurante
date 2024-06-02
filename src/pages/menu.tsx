import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { MenuService } from '../services/MenuService'
import '../styles/menuPorTipo.css'
import { ArticuloMenu } from '../types/Productos/ArticuloMenu';
import '../styles/header.css';
import Header from '../components/Header'
import Footer from '../components/Footer';


function RestaurantesPorComida() {
  const { tipoComida } = useParams()

  const [menus, setMenus] = useState<ArticuloMenu[]>([]);

  useEffect(() => {
    if (tipoComida) {
      MenuService.getMenusPorTipo(tipoComida)
        .then(menus => {
          setMenus(menus);
        })
        .catch(error => {
          console.error("Error al obtener los menús:", error);
        });
    }
  }, [tipoComida]);

  useEffect(() => {
    document.title = 'Menú - ' + tipoComida;
  }, [tipoComida]);

  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      <Header></Header>
      <div className='menu-tipo'>
        <div className="heading">
          <h1>Menú</h1>
          <h3>&mdash;{tipoComida}&mdash;</h3>
        </div>

        {menus && menus.map(menu =>
          <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
            <div className="front">
              <div className='img-food'>
                <img src={menu.imagenes[0].ruta} alt={menu.descripcion} />
                <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
              </div>
              <div className="details">
                <div className="details-sub">
                  <h5>{tipoComida}</h5>
                  <h5 className='price'>{menu.precioVenta}</h5>
                </div>
                <h5>{menu.nombre}</h5>
                <p>{menu.descripcion}</p>
                <button className="add-to-cart">Añadir al carrito</button>
              </div>
            </div>
            <div className="back">
              <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
              <div className="table">
                <div className="table-header">
                  <div className="table-cell">INGREDIENTES</div>
                  <div className="table-cell">CANTIDAD</div>
                </div>
                {menu.ingredientesMenu && menu.ingredientesMenu.map(ingrediente =>
                  <div className="table-row">
                    <div className="table-cell">{ingrediente.ingrediente.nombre}</div>
                    <div className="table-cell">{ingrediente.cantidad}</div>
                  </div>
                )}
              </div>
              <div className='details-back'>
                <button>Añadir al carrito</button>
              </div>
            </div>
          </div>
        )}



      </div>
      <Footer />
    </>
  );

}

export default RestaurantesPorComida;
