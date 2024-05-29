import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { MenuService } from '../services/MenuService'
import ModalFlotante from '../components/ModalFlotante';
import { DetallesMenu } from '../components/Menus/DetallesMenu';
import '../styles/menuPorTipo.css'
import { ArticuloMenuDTO } from '../types/Productos/ArticuloMenuDTO';

function RestaurantesPorComida(this: any) {
  const { tipoComida } = useParams()

  const [menus, setMenus] = useState<ArticuloMenuDTO[]>([]);

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

  const [showDetailsMenu, setShowDetailsMenuModal] = useState(false);

  const handleMostrarMenu = () => {
    setShowDetailsMenuModal(true);
  };

  const handleModalClose = () => {
    setShowDetailsMenuModal(false);
  };

  useEffect(() => {
    document.title = 'Menú - ' + tipoComida;
  }, []);

  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };


  return (
    <>
      <div className='menu-tipo'>
        <div className="heading">
          <h1>Menú</h1>
          <h3>&mdash;{tipoComida}&mdash;</h3>
        </div>



        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>Hamburguesa</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>Hamburguesa</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>Hamburguesa</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>Hamburguesa</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>Hamburguesa</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>Hamburguesa</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>Hamburguesa</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>Hamburguesa</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>
        <div className={`food-items ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <div className='img-food'>
                  <img src="../src/assets/img/hamburguesa-background.png" alt="Hamburguesa" />
                  <h5 className='ver-ingredientes' onClick={flipCard}>VER INGREDIENTES</h5>
                </div>
                <div className="details">
                  <div className="details-sub">
                    <h5>Hamburguesa</h5>
                    <h5 className='price'>$4999</h5>
                  </div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae quidem deserunt saepe laborum debitis, nobis nisi deleniti odit aliquid magni ex sint velit blanditiis placeat ea neque porro libero quas?</p>
                  <button className="add-to-cart">Añadir al carrito</button>
                </div>
              </div>
              <div className="back">
                <h5 onClick={flipCard} className='volver-ingrediente'>⭠ VOLVER</h5>
                <div className="details-sub">
                  <h5>Hamburguesa</h5>
                  <h5 className='price'>$4999</h5>
                </div>
                <div className="table">
                  <div className="table-header">
                    <div className="table-cell">INGREDIENTE</div>
                    <div className="table-cell">CANTIDAD</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 1</div>
                    <div className="table-cell">1 unidad</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">Ingrediente 2</div>
                    <div className="table-cell">100 gramos</div>
                  </div>
                </div>

                <div className='details-back'>
                  <button>Añadir al carrito</button>
                </div>
              </div>
        </div>





      </div>
    </>


  );

}

export default RestaurantesPorComida;

/*<div id="grid-container">
      {menus.length > 0 && menus.map((menu) => (
        <div key={menu.id} className="grid-item" onClick={handleMostrarMenu} style={{ width: '300px' }}>
          {menu.imagenesDTO.length > 0 && (
            <img key={menu.imagenesDTO[0].nombre} src={menu.imagenesDTO[0].ruta} alt={menu.imagenesDTO[0].nombre} />
          )}
          <h2>{menu.nombre}</h2>
          <h2>${menu.precioVenta}</h2>
          <h2>Descripción: {menu.descripcion}</h2>
          <h2><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32">
            <path d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 10.464844 10.464844 6 16 6 Z M 15 8 L 15 17 L 22 17 L 22 15 L 17 15 L 17 8 Z"></path>
          </svg>{menu.tiempoCoccion} minutos</h2>

          <ModalFlotante isOpen={showDetailsMenu} onClose={handleModalClose}>
            <DetallesMenu menuActual={menu} />
          </ModalFlotante>
        </div>
      ))
      }
    </div > */