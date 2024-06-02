import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { MenuService } from '../services/MenuService'
import '../styles/menuPorTipo.css'
import { ArticuloMenu } from '../types/Productos/ArticuloMenu';
import '../styles/header.css';
import Header from '../components/Header'
import Footer from '../components/Footer';
import { CarritoService } from '../services/CarritoService';


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
          <div key={menu.id} className={`food-items ${isFlipped ? 'flipped' : ''}`}>
            <div className="front">
              <div className='img-food'>
                <img src={menu.imagenes[0].ruta} alt={menu.descripcion} />
                <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
              </div>
              <div className="details">
                <div className="details-sub">
                  <h5>{ }</h5>
                  <h5 className='price'>${menu.precioVenta}</h5>
                </div>
                <h5>{menu.nombre}</h5>
                <p>{menu.descripcion}</p>
                <button className='btn-agregar' onClick={() => CarritoService.agregarAlCarrito(menu, null, 1)}>Añadir al carrito</button>
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
                  <div key={ingrediente.id} className="table-row">
                    <div className="table-cell">{ingrediente.ingrediente.nombre}</div>
                    <div className="table-cell">{ingrediente.cantidad} {ingrediente.medida.nombre}</div>
                  </div>
                )}
              </div>
              <div className='details-back'>
                <button className='btn-agregar' onClick={() => CarritoService.agregarAlCarrito(menu, null, 1)}>Añadir al carrito</button>
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
