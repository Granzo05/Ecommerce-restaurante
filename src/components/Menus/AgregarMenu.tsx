import { useState } from 'react';
import { Menu } from '../../types/Menu';
import { MenuService } from '../../services/MenuService';
import { IngredienteMenu } from '../../types/IngredienteMenu';
import { Ingrediente } from '../../types/Ingrediente';
import AgregarStock from '../Stock/AgregarStock';
import ModalFlotante from '../ModalFlotante';

function AgregarMenu() {

  type Imagen = {
    index: number;
    file: File | null;
  };

  const handleImagen = (index: number, file: File | null) => {
    if (file) {
      const newImagenes = [...imagenes];
      newImagenes[index] = { ...newImagenes[index], file };
      setImagenes(newImagenes);
    }
  };

  const añadirCampoImagen = () => {
    setImagenes([...imagenes, { index: imagenes.length, file: null }]);
  };


  // Ingredientes


  const handleNombreIngredienteChange = (index: number, nombre: string) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index].ingrediente.nombre = nombre;
    setIngredientes(nuevosIngredientes);
  };

  const handleCantidadIngredienteChange = (index: number, cantidad: number) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index].cantidad = cantidad;
    setIngredientes(nuevosIngredientes);
  };

  const añadirCampoIngrediente = () => {
    // Agrego un nuevo ingrediente vacío al estado
    setIngredientes([...ingredientes, { ingrediente: new Ingrediente(), cantidad: 0 }]);
  };

  // ModalCrud de ingrediente
  const [showAgregarStockModal, setShowAgregarStockModal] = useState(false);

  const handleAgregarStock = () => {
    setShowAgregarStockModal(true);
  };

  const handleModalClose = () => {
    setShowAgregarStockModal(false);
  };

  const [tiempoCoccion, setTiempo] = useState(0);
  const [tipo, setTipo] = useState('hamburguesas');
  const [comensales, setComensales] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [nombre, setNombre] = useState('');
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [descripcion, setDescripcion] = useState('');
  const [ingredientes, setIngredientes] = useState<IngredienteMenu[]>([]);

  function agregarMenu() {
    const menu: Menu = new Menu();
    menu.nombre = nombre;
    menu.tiempoCoccion = tiempoCoccion;
    menu.tipo = tipo;
    menu.comensales = comensales;
    menu.precio = precio;
    menu.descripcion = descripcion;
    menu.ingredientes = ingredientes;

    MenuService.createMenu(menu, imagenes);
  }

  return (
    <div className="modal-info">
      <div id="inputs-imagenes">
        {imagenes.map((imagen, index) => (
          <div key={index}>
            <input
              type="file"
              accept="image/*"
              maxLength={10048576}
              onChange={(e) => handleImagen(index, e.target.files?.[0] ?? null)}
            />
          </div>
        ))}
        <button onClick={añadirCampoImagen}>Añadir imagen</button>
      </div>
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Nombre del menu" id="nombreMenu" onChange={(e) => { setNombre(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Descripción del menu" id="descripcion" onChange={(e) => { setDescripcion(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Minutos de coccion" id="coccionMenu" onChange={(e) => { setTiempo(parseInt(e.target.value)) }} />
      </label>
      <br />
      <label>
        <select id="tipoMenu" name="tipoMenu" onChange={(e) => { setTipo(e.target.value) }}>
          <option value="hamburguesas">Hamburguesas</option>
          <option value="panchos">Panchos</option>
          <option value="empanadas">Empanadas</option>
          <option value="pizzas">Pizzas</option>
          <option value="lomos">Lomos</option>
          <option value="helados">Helado</option>
          <option value="parrilla">Parrilla</option>
          <option value="pastas">Pastas</option>
          <option value="sushi">Sushi</option>
          <option value="milanesas">Milanesas</option>
        </select>
      </label>
      <br />
      <div>
        <h2>Ingredientes</h2>
        <button onClick={() => handleAgregarStock()}>Cargar nuevo ingrediente</button>
        <ModalFlotante isOpen={showAgregarStockModal} onClose={handleModalClose}>
          <AgregarStock />
        </ModalFlotante>
        {ingredientes.map((ingredienteMenu, index) => (
          <div key={index}>
            <select
              id={`select-ingredientes-${index}`}
              onChange={(e) => handleNombreIngredienteChange(index, e.target.value)}
            >
            </select>
            <input
              type="number"
              value={ingredienteMenu.cantidad}
              placeholder="Cantidad necesaria"
              onChange={(e) => handleCantidadIngredienteChange(index, parseInt(e.target.value))}
            />
          </div>
        ))}
        <button onClick={añadirCampoIngrediente}>Añadir ingrediente</button>
      </div>
      <br />
      <label>
        <i className='bx bx-price'></i>
        <input type="number" placeholder="Precio" id="precioMenu" onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-price'></i>
        <input type="number" placeholder="Comensales" id="comensales" onChange={(e) => { setComensales(parseFloat(e.target.value)) }} />
      </label>
      <br />
      <input type="button" value="agregarMenu" id="agregarMenu" onClick={agregarMenu} />
    </div>
  )
}

export default AgregarMenu
