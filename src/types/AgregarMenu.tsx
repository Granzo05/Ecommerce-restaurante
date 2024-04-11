import { useState } from 'react';
import { Menu } from '../types/Menu';
import { MenuService } from '../services/MenuService';
import { IngredienteMenu } from '../types/IngredienteMenu';
import { Ingrediente } from '../types/Ingrediente';

function AgregarMenu() {
  const handleImagen = (index: number, file: File | null) => {
    if (file) {
      const newImagenes = [...imagenes];
      newImagenes[index] = file;
      setImagenes(newImagenes);
    }
  };

  const añadirCampoImagen = () => {
    const index = imagenes.length;

    const imagen = document.createElement('input');
    imagen.type = 'file';
    imagen.accept = "image/*";
    imagen.maxLength = 10048576;
    imagen.addEventListener('input', (e) => {
      if (e.target instanceof HTMLInputElement) {
        handleImagen(index, e.target.files?.[0] ?? null);
      }
    });

    document.getElementById('inputs-imagenes')?.appendChild(imagen);
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
    }); document.getElementById('inputs-container')?.appendChild(inputCantidad);
  };


  const [tiempoCoccion, setTiempo] = useState(0);
  const [tipo, setTipo] = useState('hamburguesas');
  const [comensales, setComensales] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [nombre, setNombre] = useState('');
  const [imagenes, setImagenes] = useState<File[]>([]);
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
            <input type="file" accept="image/*" maxLength={10048576} onChange={(e) => handleImagen(index, e.target.files?.[0] ?? null)} />
          </div>
        ))}
      </div>
      <button onClick={añadirCampoImagen}>Agregar Imagen</button>
      <br />
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
        {ingredientes.map((ingredienteMenu, index) => (
          <div key={index}>
            <input
              type="text"
              value={ingredienteMenu.ingrediente.nombre}
              placeholder="Ingrediente"
              onChange={(e) => handleNombreIngredienteChange(index, e.target.value)}
            />
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
