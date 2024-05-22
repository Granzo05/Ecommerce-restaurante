import { useState } from 'react';
import { IngredienteMenu } from '../../types/Ingredientes/IngredienteMenu';
import { MenuService } from '../../services/MenuService';
import ModalFlotante from '../ModalFlotante';
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
import AgregarIngrediente from '../Ingrediente/AgregarIngrediente';
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendaciones from '../ModalFlotanteRecomendaciones';

interface EditarMenuProps {
  menuOriginal: ArticuloMenuDTO;
}

const EditarMenu: React.FC<EditarMenuProps> = ({ menuOriginal }) => {
  const [ingredientes, setIngredientes] = useState<IngredienteMenu[]>([]);
  const [ingredientesMuestra, setIngredientesMuestra] = useState<IngredienteMenuDTO[]>(menuOriginal.ingredientesMenu);
  let [selectIndexIngredientes, setSelectIndexIngredientes] = useState<number>(0);
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

  // Ingredientes viejos

  const handleCantidadIngredienteMostrableChange = (index: number, cantidad: number) => {
    const nuevosIngredientes = [...ingredientesMuestra];
    nuevosIngredientes[index].cantidad = cantidad;
    setIngredientesMuestra(nuevosIngredientes);
  };

  const handleMedidaIngredienteMostrableChange = (index: number, medida: EnumMedida | string) => {
    const nuevosIngredientes = [...ingredientesMuestra];
    nuevosIngredientes[index].medida = medida;
    setIngredientesMuestra(nuevosIngredientes);
  };

  ///////// INGREDIENTES

  const handleNombreIngredienteChange = (index: number, nombre: string) => {
    const nuevosIngredientes = [...ingredientes];
    console.log(nuevosIngredientes)
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
    // SI no hay ingredientes que genere en valor 0 de index
    if (ingredientes.length === 0) {
      setIngredientes([...ingredientes, { id: 0, ingrediente: new Ingrediente(), cantidad: 0, medida: '', articuloMenu: null, borrado: 'NO' }]);
    } else {
      setIngredientes([...ingredientes, { id: 0, ingrediente: new Ingrediente(), cantidad: 0, medida: '', articuloMenu: null, borrado: 'NO' }]);
      setSelectIndexIngredientes(prevIndex => prevIndex + 1);
    }
  };

  const quitarCampoIngrediente = (index: number) => {
    if (imagenes.length > 0) {

      const nuevosIngredientes = [...ingredientes];
      nuevosIngredientes.splice(index, 1);
      setIngredientes(ingredientes);

      if (selectIndexIngredientes > 0) {
        selectIndexIngredientes--;
      }
    } else {
      const nuevosIngredientes = [...ingredientes];
      nuevosIngredientes.pop();
      setIngredientes(nuevosIngredientes);
      selectIndexIngredientes = 0;
    }
  };

  const quitarCampoIngredienteMuestra = (index: number) => {
    if (ingredientesMuestra.length > 0) {
      const nuevosIngredientes = [...ingredientesMuestra];
      nuevosIngredientes.splice(index, 1);
      setIngredientesMuestra(nuevosIngredientes);
    }
  };

  // Modal flotante de ingrediente
  const [showAgregarIngredienteModal, setShowAgregarIngredienteModal] = useState(false);

  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
  const [mostrarDatos, setMostrarDatos] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [elementosABuscar, setElementosABuscar] = useState<string>('');

  const handleSelectProduct = (product: string) => {
    setSelectedProduct(product);
  };

  const handleAbrirRecomendaciones = (busqueda: string) => {
    setElementosABuscar(busqueda)
    setMostrarDatos(false);
    setModalBusqueda(true);
  };

  const handleAgregarIngrediente = () => {
    setMostrarDatos(false);
    setShowAgregarIngredienteModal(true);
  };

  const handleModalClose = () => {
    setShowAgregarIngredienteModal(false);
    setModalBusqueda(false)
    if (selectedProduct) {
      handleNombreIngredienteChange(selectIndexIngredientes, selectedProduct);
    }
    setMostrarDatos(true);
  };

  function editarMenu() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!tiempoCoccion) {
      toast.error("Por favor, es necesaria el tiempo de cocción");
      return;
    } else if (!comensales) {
      toast.error("Por favor, es necesaria la cantidad de comensales comensales");
      return;
    } else if (!precioVenta) {
      toast.error("Por favor, es necesario el precio");
      return;
    } else if (!tipo) {
      toast.error("Por favor, es necesario el tipo");
      return;
    } else if (imagenes.length === 0 && imagenesMuestra.length === 0) {
      toast.info("No se asignó ninguna imagen");
      return;
    } else if (!descripcion) {
      toast.error("Por favor, es necesaria la descripción");
      return;
    }

    for (let i = 0; i < ingredientes.length; i++) {
      const ingrediente = ingredientes[i].ingrediente;
      const cantidad = ingredientes[i].cantidad;
      const medida = ingredientes[i].medida;

      if (!ingrediente?.nombre) {
        toast.info(`Por favor, el ingrediente ${i} debe contener el nombre`);
        return;
      } else if (cantidad === 0) {
        toast.info(`Por favor, la cantidad de ${ingrediente.nombre} debe ser mayor a 0`);
        return;
      } else if (!medida) {
        toast.info(`Por favor, la cantidad asignada a ${ingrediente.nombre} debe contener la medida`);
        return;
      }
    }

    let menuActualizado: ArticuloMenu = new ArticuloMenu();

    menuActualizado.nombre = nombre;
    menuActualizado.tiempoCoccion = tiempoCoccion;
    menuActualizado.tipo = tipo;
    menuActualizado.comensales = comensales;
    menuActualizado.precioVenta = precioVenta;
    menuActualizado.descripcion = descripcion;
    menuActualizado.id = menuOriginal.id;

    if (ingredientesMuestra.length > 0) {
      ingredientesMuestra.forEach(ingredienteDTO => {
        let ingredienteMenu: IngredienteMenu = new IngredienteMenu();

        ingredienteMenu.medida = ingredienteDTO.medida;
        ingredienteMenu.cantidad = ingredienteDTO.cantidad;

        let ingrediente: Ingrediente = new Ingrediente();
        ingrediente.nombre = ingredienteDTO.ingredienteNombre;
        ingredienteMenu.ingrediente = ingrediente;

        menuActualizado.ingredientesMenu?.push(ingredienteMenu);
      });
    }

    if (ingredientes.length > 0) {
      ingredientes.forEach(ingredienteMenu => {
        menuActualizado.ingredientesMenu?.push(ingredienteMenu);
      });
    }


    toast.promise(MenuService.updateMenu(menuActualizado, imagenes, imagenesEliminadas), {
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
      <Toaster />
      {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputDepartamento='' inputProvincia='' />}

      {mostrarDatos && (
        <div>
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
          <div className="inputBox">
            <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
            <span>Nombre del menu</span>
          </div>
          <div className="inputBox">
            <input type="text" required={true} value={descripcion} onChange={(e) => { setDescripcion(e.target.value) }} />
            <span>Descripción del menu</span>
          </div>
          <div className="inputBox">
            <input type="number" required={true} value={tiempoCoccion} onChange={(e) => { setTiempo(parseInt(e.target.value)) }} />
            <span>Minutos de coccion</span>
          </div>
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
            <button onClick={() => handleAgregarIngrediente()}>Cargar nuevo ingrediente</button>
            <ModalFlotante isOpen={showAgregarIngredienteModal} onClose={handleModalClose}>
              <AgregarIngrediente />
            </ModalFlotante>
            {ingredientesMuestra.map((ingredienteMenu, index) => (
              <div key={index} className='div-ingrediente-menu'>
                <div className="inputBox">
                  <input type="text" required={true} value={ingredienteMenu.ingredienteNombre} onChange={(e) => { setTiempo(parseInt(e.target.value)) }} />
                  <span>Nombre del ingrediente</span>
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={ingredienteMenu.cantidad} onChange={(e) => handleCantidadIngredienteMostrableChange(index, parseFloat(e.target.value))} />
                  <span>Cantidad necesaria</span>
                </div>
                <select
                  id={`select-medidas-${index}`}
                  value={ingredienteMenu?.medida?.toString()}
                  onChange={(e) => handleMedidaIngredienteMostrableChange(index, e.target.value)}
                >
                  <option value="">Seleccionar medida ingrediente</option>
                  <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
                  <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
                  <option value={EnumMedida.LITROS.toString()}>Litros</option>
                  <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
                  <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
                </select>
                <p onClick={() => quitarCampoIngredienteMuestra(index)}>X</p>
              </div>
            ))}
            {ingredientes.map((ingredienteMenu, index) => (
              <div key={index} className='div-ingrediente-menu'>
                <div>
                  <InputComponent placeHolder='Seleccionar ingrediente...' onInputClick={() => handleAbrirRecomendaciones('INGREDIENTES')} selectedProduct={ingredienteMenu.ingrediente?.nombre ?? ''} />
                  <br />
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={ingredienteMenu.cantidad} onChange={(e) => handleCantidadIngredienteChange(index, parseFloat(e.target.value))} />
                  <span>Cantidad necesaria</span>
                </div>
                <select
                  id={`select-medidas-${index}`}
                  onChange={(e) => handleMedidaIngredienteChange(index, e.target.value)}
                >
                  <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
                  <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
                  <option value={EnumMedida.LITROS.toString()}>Litros</option>
                  <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
                  <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
                </select>

                <p onClick={() => quitarCampoIngrediente(index)}>X</p>
              </div>
            ))}
            <button onClick={añadirCampoIngrediente}>Añadir ingrediente</button>
          </div>
          <div className="inputBox">
            <input type="number" required={true} value={precioVenta} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
            <span>Precio</span>
          </div>
          <div className="inputBox">
            <input type="number" required={true} value={comensales} onChange={(e) => { setComensales(parseInt(e.target.value)) }} />
            <span>Comensales</span>
          </div>
          <button className='button-form' type='button' onClick={editarMenu}>Editar menu</button>
        </div>
      )}



    </div >
  )
}


export default EditarMenu
