import { useState } from 'react';
import { IngredienteMenu } from '../../types/IngredienteMenu';
import { Menu } from '../../types/Menu';
import { MenuService } from '../../services/MenuService';
import { Multipart } from '../../types/Multipart';

interface EditarMenuProps {
  menuOriginal: Menu;
}

const EditarMenu: React.FC<EditarMenuProps> = ({ menuOriginal }) => {

  const handleImagen = (index: number, file: File | null) => {
    const newImagenes = [...imagenes];
    if (file) {
      newImagenes[index] = { nombre: menuOriginal.nombre, value: file };
      setImagenes(newImagenes);
    } 
  };

  const añadirInputsFiles = () => {
    setImagenes([...imagenes, { nombre: '', value: null }]);
  };

  ///////// INGREDIENTES

  const handleNombreIngredienteChange = (index: number, nombre: string) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index].nombre = nombre;
    setIngredientes(nuevosIngredientes);
  };

  const handleCantidadIngredienteChange = (index: number, cantidad: number) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index].cantidad = cantidad;
    setIngredientes(nuevosIngredientes);
  };

  const añadirCampoIngrediente = () => {
    // Agrego un nuevo ingrediente vacío al estado
    setIngredientes([...ingredientes, { nombre: '', cantidad: 0 }]);

    // Dos nuevos inputs al DOM
    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.placeholder = 'Ingrediente';
    inputNombre.className = 'ingredienteMenu';
    inputNombre.addEventListener('input', (e) => {
      if (e.target instanceof HTMLInputElement) {
        handleNombreIngredienteChange(ingredientes.length, e.target.value);
      }
    });

    document.getElementById('inputs-container')?.appendChild(inputNombre);

    const inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.placeholder = 'Cantidad necesaria';
    inputCantidad.className = 'cantidadIngrediente';
    inputNombre.addEventListener('input', (e) => {
      if (e.target instanceof HTMLInputElement) {
        handleCantidadIngredienteChange(ingredientes.length, parseInt(e.target.value));
      }
    }); document.getElementById('inputs-ingredientes')?.appendChild(inputCantidad);
  };

  const [tiempoCoccion, setTiempo] = useState(0);
  const [tipo, setTipo] = useState('');
  const [comensales, setComensales] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [nombre, setNombre] = useState('');
  const [imagenes, setImagenes] = useState<Multipart[]>([{ nombre: '', value: null }]);
  const [descripcion, setDescripcion] = useState('');
  const [ingredientes, setIngredientes] = useState<IngredienteMenu[]>([]);

  function editarMenu() {
    const menu: Menu = new Menu();
    menu.id = menuOriginal.id;
    menu.nombre = nombre;
    menu.tiempoCoccion = tiempoCoccion;
    menu.tipo = tipo;
    menu.comensales = comensales;
    menu.precio = precio;
    menu.descripcion = descripcion;
    menu.ingredientes = ingredientes;
    menu.imagenes = imagenes;

    MenuService.updateMenu(menu);
  }

  return (
    <div>
      <div id="container-items">
      </div>

      <div id="miModal" className="modal">
        <div className="modal-content">
          <div id="inputs-imagenes">
            {imagenes.map((imagen, index) => (
              <div key={index}>
                <input type="file" onChange={(e) => handleImagen(index, e.target.files?.[0] ?? null)} />
                {imagen.nombre && <span>{imagen.nombre}</span>}
              </div>
            ))}
          </div>
          <button onClick={añadirInputsFiles}>Añadir imagen</button>
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="Nombre del menu" value={menuOriginal.nombre} id="nombreMenu" onChange={(e) => { setNombre(e.target.value) }} />
          </label>
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="Descripción del menu" value={menuOriginal.descripcion} id="descripcion" onChange={(e) => { setDescripcion(e.target.value) }} />
          </label>
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="Minutos de coccion" value={menuOriginal.tiempoCoccion} id="coccionMenu" onChange={(e) => { setTiempo(parseInt(e.target.value)) }} />
          </label>
          <br />
          <label>
            <select id="tipoMenu" value={menuOriginal.tipo} name="tipoMenu" onChange={(e) => { setTipo(e.target.value) }}>
              <option value="HAMBURGUESAS">Hamburguesas</option>
              <option value="PANCHOS">Panchos</option>
              <option value="EMPANADAS">Empanadas</option>
              <option value="PIZZAS">Pizzas</option>
              <option value="LOMOS">Lomos</option>
              <option value="HELADO">Helado</option>
              <option value="PARRILLA">Parrilla</option>
              <option value="PASTAS">Pastas</option>
              <option value="SUSHI">Sushi</option>
              <option value="VEGETARIANO">Vegetariano</option>
              <option value="MILANESAS">Milanesas</option>
            </select>
          </label>
          <br />
          <div id='inputs-ingredientes'>
            {menuOriginal.ingredientes.map((ingrediente: IngredienteMenu, index: number) => (
              <div key={index}>
                <input
                  type="text"
                  value={ingrediente.nombre}
                  placeholder="Ingrediente"
                  onChange={(e) => handleNombreIngredienteChange(index, e.target.value)}
                />
                <input
                  type="number"
                  value={ingrediente.cantidad}
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
            <input type="number" value={menuOriginal.precio} placeholder="Precio" id="precioMenu" onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
          </label>
          <br />
          <label>
            <i className='bx bx-price'></i>
            <input type="number" placeholder="Comensales" value={menuOriginal.comensales} id="comensales" onChange={(e) => { setComensales(parseFloat(e.target.value)) }} />
          </label>
          <br />
          <input type="button" value="editarMenu" id="editarMenu" onClick={editarMenu} />
        </div>
      </div>
    </div>
  )
}

export default EditarMenu
