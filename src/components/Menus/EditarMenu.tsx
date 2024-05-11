import { useState } from 'react';
import { IngredienteMenu } from '../../types/Ingredientes/IngredienteMenu';
import { MenuService } from '../../services/MenuService';
import ModalFlotante from '../ModalFlotante';
import AgregarStock from '../Stock/AgregarStockArticulo';
import { IngredienteService } from '../../services/IngredienteService';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import { ArticuloMenu } from '../../types/Productos/ArticuloMenu';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import { EnumTipoArticuloComida } from '../../types/Productos/EnumTipoArticuloComida';
import { ImagenesProductoDTO } from '../../types/Productos/ImagenesProductoDTO';
import { ImagenesProducto } from '../../types/Productos/ImagenesProducto';
import { Toaster, toast } from 'sonner'

interface EditarMenuProps {
  menuOriginal: ArticuloMenu;
}

const EditarMenu: React.FC<EditarMenuProps> = ({ menuOriginal }) => {
  const [ingredientes, setIngredientes] = useState<IngredienteMenu[]>([]);
  const [ingredientesSelect, setIngredientesSelect] = useState<Ingrediente[]>([]);
  const [imagenesMuestra] = useState<ImagenesProductoDTO[]>(menuOriginal.imagenes);
  const [imagenes, setImagenes] = useState<ImagenesProducto[]>(menuOriginal.imagenes);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const [tiempoCoccion, setTiempo] = useState(menuOriginal.tiempoCoccion);
  const [tipo, setTipo] = useState<EnumTipoArticuloComida | null>(menuOriginal.tipo);
  const [comensales, setComensales] = useState(menuOriginal.comensales);
  const [precioVenta, setPrecio] = useState(menuOriginal.precioVenta);
  const [nombre, setNombre] = useState(menuOriginal.nombre);
  const [descripcion, setDescripcion] = useState(menuOriginal.descripcion);

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
    let imagenNueva = new ImagenesProducto();
    imagenNueva.index = imagenes.length;
    setImagenes([...imagenes, imagenNueva]);
  };

  ///////// INGREDIENTES

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

  const handleMedidaIngredienteChange = (index: number, medida: EnumMedida) => {
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

      if (selectIndex > 0) {
        setSelectIndex(prevIndex => prevIndex - 1);
      }
    }
  };

  // Modal flotante de ingrediente
  const [showAgregarStockModal, setShowAgregarStockModal] = useState(false);

  const handleAgregarStock = () => {
    setShowAgregarStockModal(true);
  };

  const handleModalClose = () => {
    setShowAgregarStockModal(false);
    cargarSelectsIngredientes();
  };

  function editarMenu() {
    if (!nombre || !tiempoCoccion || !tipo || !comensales || !precioVenta || !descripcion) {
      toast.info("Por favor, complete todos los campos requeridos.");
      return;
    }

    const menuActualizado: ArticuloMenu = {
      ...menuOriginal,
      nombre,
      tiempoCoccion,
      tipo,
      comensales,
      precioVenta,
      descripcion,
      ingredientesMenu: ingredientes
    };
    console.log(menuActualizado)
    console.log(imagenes)
    toast.promise(MenuService.updateMenu(menuActualizado, imagenes), {
      loading: 'Editando menu...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <Toaster/>
      <div id="inputs-imagenes">
        {imagenesMuestra.map((imagen, index) => (
          <div key={index}>
            <input
              type="file"
              accept="image/*"
              maxLength={10048576}
              disabled
            />
            {imagen && <img src={imagen.ruta} alt={`Imagen ${index}`} />}
          </div>
        ))}
        {imagenes.map((imagen, index) => (
          <div key={index}>
            <input
              type="file"
              accept="image/*"
              maxLength={10048576}
              onChange={(e) => handleImagen(index, e.target.files?.[0] ?? null)}
            />
            {imagen && <img src={imagen.ruta} alt={`Imagen ${index}`} />}
          </div>
        ))}
        <button onClick={añadirCampoImagen}>Añadir imagen</button>
      </div>
      <input type="text" placeholder="Nombre del menu" value={nombre} onChange={(e) => { setNombre(e.target.value) }} />

      <br />
      <input type="text" placeholder="Descripción del menu" value={descripcion} onChange={(e) => { setDescripcion(e.target.value) }} />

      <br />
      <input type="text" placeholder="Minutos de coccion" value={tiempoCoccion} onChange={(e) => { setTiempo(parseInt(e.target.value)) }} />

      <br />
      <label>
        <select
          id="tipoMenu"
          value={tipo ? tipo.toString() : ""}
          name="tipoMenu"
          onChange={(e) => {
            setTipo(parseInt(e.target.value));
          }}
        >
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
        <button onClick={() => handleAgregarStock()}>Cargar nuevo ingrediente</button>
        <ModalFlotante isOpen={showAgregarStockModal} onClose={handleModalClose}>
          <AgregarStock />
        </ModalFlotante>
        {ingredientes.map((ingredienteMenu, index) => (
          <div key={index} className='div-ingrediente-menu'>
            <select
              id={`select-ingredientes-${index}`}
              value={ingredienteMenu.ingrediente?.nombre}
              onChange={(e) => handleNombreIngredienteChange(index, e.target.value)}
            >
              <option value="">Seleccionar ingrediente</option>
              {ingredientesSelect.map((ingrediente, index) => (
                <option key={index} value={ingrediente.nombre}>{ingrediente.nombre}</option>
              ))}
            </select>
            <input
              type="number"
              value={ingredienteMenu.cantidad}
              placeholder="Cantidad necesaria"
              onChange={(e) => handleCantidadIngredienteChange(index, parseFloat(e.target.value))}
            />
            <select
              id={`select-medidas-${index}`}
              value={ingredienteMenu.ingrediente?.medida?.toString()}
              onChange={(e) => handleMedidaIngredienteChange(index, parseInt(e.target.value))}
            >
              <option value="">Seleccionar medida ingrediente</option>
              <option value={EnumMedida.KILOGRAMOS}>Kilogramos</option>
              <option value={EnumMedida.GRAMOS}>Gramos</option>
              <option value={EnumMedida.LITROS}>Litros</option>
              <option value={EnumMedida.CENTIMETROS_CUBICOS}>Centimetros cúbicos</option>
              <option value={EnumMedida.UNIDADES}>Unidades</option>
            </select>
            <p onClick={quitarCampoIngrediente}>X</p>
          </div>
        ))}
        <button onClick={añadirCampoIngrediente}>Añadir ingrediente</button>
      </div>
      <br />
      <input type="number" placeholder="Precio" value={precioVenta} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />

      <br />
      <input type="number" placeholder="Comensales" value={comensales} onChange={(e) => { setComensales(parseFloat(e.target.value)) }} />

      <br />
      <button className='button-form' type='button' onClick={editarMenu}>Editar menu</button>
    </div >
  )
}


export default EditarMenu
