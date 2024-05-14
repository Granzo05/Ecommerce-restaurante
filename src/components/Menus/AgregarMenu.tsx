import { useState } from 'react';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import ModalFlotante from '../ModalFlotante';
import { IngredienteService } from '../../services/IngredienteService';
import { IngredienteMenu } from '../../types/Ingredientes/IngredienteMenu';
import { MenuService } from '../../services/MenuService';
import { ImagenesProducto } from '../../types/Productos/ImagenesProducto';
import { ArticuloMenu } from '../../types/Productos/ArticuloMenu';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import { Toaster, toast } from 'sonner'
import { EnumTipoArticuloComida } from '../../types/Productos/EnumTipoArticuloComida';
import AgregarIngrediente from '../Ingrediente/AgregarIngrediente';
import { convertirStringAEnumMedida } from '../../utils/global_variables/functions';

function AgregarMenu() {
  const [ingredientes, setIngredientes] = useState<IngredienteMenu[]>([]);
  const [ingredientesSelect, setIngredientesSelect] = useState<Ingrediente[]>([]);
  const [imagenes, setImagenes] = useState<ImagenesProducto[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  function cargarSelectsIngredientes() {
    IngredienteService.getIngredientes()
      .then(data => {
        setIngredientesSelect(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const handleImagen = (index: number, file: File | null) => {
    if (file) {
      const newImagenes = [...imagenes];
      newImagenes[index] = { ...newImagenes[index], file };
      setImagenes(newImagenes);
    }
  };

  const añadirCampoImagen = () => {
    setImagenes([...imagenes, { index: imagenes.length, file: null } as ImagenesProducto]);
  };

  const quitarCampoImagen = () => {
    if (imagenes.length > 0) {
      const nuevasImagenes = [...imagenes];
      nuevasImagenes.pop();
      setImagenes(nuevasImagenes);

      if (selectIndex > 0) {
        setSelectIndex(prevIndex => prevIndex - 1);
      }
    }
  };

  // Ingredientes

  const handleNombreIngredienteChange = (index: number, nombre: string) => {
    const nuevosIngredientes = [...ingredientes];
    if (nuevosIngredientes && nuevosIngredientes[index].ingrediente) {
      nuevosIngredientes[index].ingrediente.nombre = nombre;
      setIngredientes(nuevosIngredientes);
    }
  };

  const handleCantidadIngredienteChange = (index: number, cantidad: number) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index].cantidad = cantidad;
    setIngredientes(nuevosIngredientes);
  };

  const handleMedidaIngredienteChange = (index: number, medida: EnumMedida | null) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index].medida = medida;
    setIngredientes(nuevosIngredientes);
  };

  const añadirCampoIngrediente = () => {
    setIngredientes([...ingredientes, { id: 0, ingrediente: new Ingrediente(), cantidad: 0, medida: EnumMedida.CENTIMETROS_CUBICOS, articuloMenu: null }]);
    setSelectIndex(prevIndex => prevIndex + 1);
    cargarSelectsIngredientes();
  };

  const quitarCampoIngrediente = () => {
    if (ingredientes.length > 0) {
      const nuevosIngredientes = [...ingredientes];
      nuevosIngredientes.pop();
      setIngredientes(nuevosIngredientes);
    }
  };

  // Modal flotante de ingrediente
  const [showAgregarIngredienteModal, setShowAgregarStockModal] = useState(false);

  const handleAgregarIngrediente = () => {
    setShowAgregarStockModal(true);
  };

  const handleModalClose = () => {
    setShowAgregarStockModal(false);
    cargarSelectsIngredientes();
  };

  const [tiempoCoccion, setTiempo] = useState(0);
  const [tipo, setTipo] = useState<EnumTipoArticuloComida>(0);
  const [comensales, setComensales] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  async function agregarMenu() {
    if (!nombre || !tiempoCoccion || !comensales || !precio || !descripcion) {
      toast.info("Por favor, complete todos los campos requeridos.");
      return;
    }

    const menu: ArticuloMenu = new ArticuloMenu();

    menu.nombre = nombre;
    menu.tiempoCoccion = tiempoCoccion;
    menu.tipo = tipo;
    menu.comensales = comensales;
    menu.precioVenta = precio;
    menu.descripcion = descripcion;
    menu.ingredientesMenu = ingredientes;

    toast.promise(MenuService.createMenu(menu, imagenes), {
      loading: 'Creando menu...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
    //clearInputs();

  }

  return (
    <div className="modal-info">
      <Toaster />
      <div id="inputs-imagenes">
        {imagenes.map((imagen, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'row' }}>
            <input
              type="file"
              accept="image/*"
              maxLength={10048576}
              onChange={(e) => handleImagen(index, e.target.files?.[0] ?? null)}
              style={{ width: '400px' }}
            />
            <p style={{ cursor: 'pointer', marginTop: '13px' }} onClick={quitarCampoImagen}>X</p>
          </div>
        ))}
        <button onClick={añadirCampoImagen}>Añadir imagen</button>
      </div>
      <input type="text" placeholder="Nombre del menu" id="nombreMenu" onChange={(e) => { setNombre(e.target.value) }} />

      <br />
      <input type="text" placeholder="Descripción del menu" id="descripcion" onChange={(e) => { setDescripcion(e.target.value) }} />

      <br />
      <input type="text" placeholder="Minutos de coccion" id="coccionMenu" onChange={(e) => { setTiempo(parseInt(e.target.value)) }} />

      <br />
      <label>
        <select id="tipoMenu" name="tipoMenu" onChange={(e) => { setTipo(parseInt(e.target.value)) }}>
          <option>Seleccionar tipo de menú</option>
          <option value={EnumTipoArticuloComida.HAMBURGUESAS}>Hamburguesas</option>
          <option value={EnumTipoArticuloComida.PANCHOS}>Panchos</option>
          <option value={EnumTipoArticuloComida.EMPANADAS}>Empanadas</option>
          <option value={EnumTipoArticuloComida.PIZZAS}>Pizzas</option>
          <option value={EnumTipoArticuloComida.LOMOS}>Lomos</option>
          <option value={EnumTipoArticuloComida.HELADO}>Helado</option>
          <option value={EnumTipoArticuloComida.PARRILLA}>Parrilla</option>
          <option value={EnumTipoArticuloComida.PASTAS}>Pastas</option>
          <option value={EnumTipoArticuloComida.SUSHI}>Sushi</option>
          <option value={EnumTipoArticuloComida.MILANESAS}>Milanesas</option>
        </select>
      </label>
      <br />
      <div>
        <h2>Ingredientes</h2>
        <button onClick={() => handleAgregarIngrediente()}>Cargar nuevo ingrediente</button>
        <ModalFlotante isOpen={showAgregarIngredienteModal} onClose={handleModalClose}>
          <AgregarIngrediente />
        </ModalFlotante>
        {ingredientes.map((ingredienteMenu, index) => (
          <div key={index} className='div-ingrediente-menu'>
            <select
              id={`select-ingredientes-${index}`}
              onChange={(e) => handleNombreIngredienteChange(index, e.target.value)}
            >
              <option value="">Seleccionar ingrediente</option>
              {ingredientesSelect.map((ingrediente, index) => (
                <option key={index} value={ingrediente.nombre}>{ingrediente.nombre}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Cantidad necesaria"
              onChange={(e) => handleCantidadIngredienteChange(index, parseFloat(e.target.value))}
            />
            <select
              id={`select-medidas-${index}`}
              onChange={(e) => handleMedidaIngredienteChange(index, convertirStringAEnumMedida(e.target.value))}
            >
              <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
              <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
              <option value={EnumMedida.LITROS.toString()}>Litros</option>
              <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
              <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
            </select>

            <p onClick={quitarCampoIngrediente}>X</p>
          </div>
        ))}
        <button onClick={añadirCampoIngrediente}>Añadir ingrediente</button>
      </div>
      <br />
      <input type="number" placeholder="Precio" id="precioMenu" onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />

      <br />
      <input type="number" placeholder="Comensales" id="comensales" onChange={(e) => { setComensales(parseFloat(e.target.value)) }} />

      <br />
      <button type="button" onClick={agregarMenu}>Agregar menu</button>
    </div >
  )
}

export default AgregarMenu
