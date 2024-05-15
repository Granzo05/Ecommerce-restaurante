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
import './editarMenu.css'
import { ArticuloMenuDTO } from '../../types/Productos/ArticuloMenuDTO';
import { IngredienteMenuDTO } from '../../types/Ingredientes/IngredienteMenuDTO';

interface EditarMenuProps {
  menuOriginal: ArticuloMenuDTO;
}

const EditarMenu: React.FC<EditarMenuProps> = ({ menuOriginal }) => {
  const [ingredientes, setIngredientes] = useState<IngredienteMenu[]>([]);
  const [ingredientesMuestra] = useState<IngredienteMenuDTO[]>(menuOriginal.ingredientesMenu);
  const [ingredientesRecomendados, setIngredientesRecomendados] = useState<Ingrediente[]>([]);
  const [imagenesMuestra, setImagenesMuestra] = useState<ImagenesProductoDTO[]>(menuOriginal.imagenesDTO);
  const [imagenesEliminadas, setImagenesEliminadas] = useState<ImagenesProductoDTO[]>([]);
  const [imagenes, setImagenes] = useState<ImagenesProducto[]>(menuOriginal.imagenes);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const [tiempoCoccion, setTiempo] = useState(menuOriginal.tiempoCoccion);
  const [tipo, setTipo] = useState<EnumTipoArticuloComida | string>(menuOriginal.tipo);
  const [comensales, setComensales] = useState(menuOriginal.comensales);
  const [precioVenta, setPrecio] = useState(menuOriginal.precioVenta);
  const [nombre, setNombre] = useState(menuOriginal.nombre);
  const [descripcion, setDescripcion] = useState(menuOriginal.descripcion);

  const [mostrarDatos, setMostrarDatos] = useState(true);

  function cargarResultadosIngredientes() {
    IngredienteService.getIngredientes()
      .then(data => {

        setIngredientesRecomendados(data);
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

  const handleEliminarImagen = (index: number) => {
    const nuevasImagenes = [...imagenesMuestra];
    const imagenEliminada = nuevasImagenes.splice(index, 1)[0];
    setImagenesMuestra(nuevasImagenes);
    setImagenesEliminadas([...imagenesEliminadas, imagenEliminada]);
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

  const handleMedidaIngredienteChange = (index: number, medida: EnumMedida | string) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index].medida = medida;
    setIngredientes(nuevosIngredientes);
  };

  const añadirCampoIngrediente = () => {
    setIngredientes([...ingredientes, { id: 0, ingrediente: new Ingrediente(), cantidad: 0, medida: EnumMedida.CENTIMETROS_CUBICOS, articuloMenu: null }]);
    setSelectIndex(prevIndex => prevIndex + 1);
    cargarResultadosIngredientes();
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
    setMostrarDatos(true);
    cargarResultadosIngredientes();
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

    toast.promise(MenuService.updateMenu(menuActualizado, imagenes, imagenesEliminadas), {
      loading: 'Editando menu...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });

    if (imagenes.length === 0) {
      toast.info('No se añadieron imagenes al menú');
    }
  }

  return (
    <div className="modal-info">
      <Toaster />
      <div id="inputs-imagenes">
        {imagenesMuestra.map((imagen, index) => (
          <div key={index}>
            {imagen && (
              <img
                className='imagen-muestra-menu'
                src={imagen.ruta}
                alt={`Imagen ${index}`}
              />
            )}
            <button className='button-form' type='button' onClick={() => handleEliminarImagen(index)}>X</button>
          </div>
        ))}
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

      {mostrarDatos && (
        <div>
          <input type="text" placeholder="Nombre del menu" value={nombre} onChange={(e) => { setNombre(e.target.value) }} />

          <br />
          <input type="text" placeholder="Descripción del menu" value={descripcion} onChange={(e) => { setDescripcion(e.target.value) }} />

          <br />
          <input type="text" placeholder="Minutos de coccion" value={tiempoCoccion} onChange={(e) => { setTiempo(parseInt(e.target.value)) }} />

          <br />
          <label>
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value);
              }}
            >
              <option>Seleccionar tipo</option>
              <option value={EnumTipoArticuloComida.HAMBURGUESAS.toString()}>Hamburguesas</option>
              <option value={EnumTipoArticuloComida.PANCHOS.toString()}>Panchos</option>
              <option value={EnumTipoArticuloComida.EMPANADAS.toString()}>Empanadas</option>
              <option value={EnumTipoArticuloComida.PIZZAS.toString()}>Pizzas</option>
              <option value={EnumTipoArticuloComida.LOMOS.toString()}>Lomos</option>
              <option value={EnumTipoArticuloComida.HELADO.toString()}>Helado</option>
              <option value={EnumTipoArticuloComida.PARRILLA.toString()}>Parrilla</option>
              <option value={EnumTipoArticuloComida.PASTAS.toString()}>Pastas</option>
              <option value={EnumTipoArticuloComida.SUSHI.toString()}>Sushi</option>
              <option value={EnumTipoArticuloComida.MILANESAS.toString()}>Milanesas</option>
            </select>

          </label>
          <br />
          <div>
            <h2>Ingredientes</h2>
            <button onClick={() => handleAgregarStock()}>Cargar nuevo ingrediente</button>
            <ModalFlotante isOpen={showAgregarStockModal} onClose={handleModalClose}>
              <AgregarStock />
            </ModalFlotante>
            {ingredientesMuestra.map((ingredienteMenu, index) => (
              <div key={index} className='div-ingrediente-menu'>
                <input
                  type="text"
                  placeholder="Nombre ingrediente"
                  value={ingredienteMenu.ingredienteNombre}
                  disabled
                />
                <br />
                <input
                  type="number"
                  value={ingredienteMenu.cantidad}
                  placeholder="Cantidad necesaria"
                  onChange={(e) => handleCantidadIngredienteChange(index, parseFloat(e.target.value))}
                />
                <select
                  id={`select-medidas-${index}`}
                  value={ingredienteMenu?.medida?.toString()}
                  onChange={(e) => handleMedidaIngredienteChange(index, e.target.value)}
                >
                  <option value="">Seleccionar medida ingrediente</option>
                  <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
                  <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
                  <option value={EnumMedida.LITROS.toString()}>Litros</option>
                  <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
                  <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
                </select>
                <p onClick={quitarCampoIngrediente}>X</p>
              </div>
            ))}
            {ingredientes.map((ingredienteMenu, index) => (
              <div key={index} className='div-ingrediente-menu'>
                <div>
                  <input
                    type="text"
                    placeholder="Nombre ingrediente"
                    value={ingredientes[index].ingrediente?.nombre}
                    onChange={(e) => handleNombreIngredienteChange(index, e.target.value)}
                  />
                  <br />
                  <ul className='lista-recomendaciones'>
                    {ingredientesRecomendados?.map((ingrediente, index) => (
                      <li className='opcion-recomendada' key={index} onClick={() => {
                        handleNombreIngredienteChange(index, ingrediente.nombre);
                        setIngredientesRecomendados([])
                      }}>
                        {ingrediente.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
                <input
                  type="number"
                  value={ingredienteMenu.cantidad}
                  placeholder="Cantidad necesaria"
                  onChange={(e) => handleCantidadIngredienteChange(index, parseFloat(e.target.value))}
                />
                <select
                  id={`select-medidas-${index}`}
                  value={ingredienteMenu.ingrediente?.medida?.toString()}
                  onChange={(e) => handleMedidaIngredienteChange(index, e.target.value)}
                >
                  <option value="">Seleccionar medida ingrediente</option>
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
          <input type="number" placeholder="Precio" value={precioVenta} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />

          <br />
          <input type="number" placeholder="Comensales" value={comensales} onChange={(e) => { setComensales(parseInt(e.target.value)) }} />

          <br />
          <button className='button-form' type='button' onClick={editarMenu}>Editar menu</button>
        </div>
      )}

    </div >
  )
}


export default EditarMenu
