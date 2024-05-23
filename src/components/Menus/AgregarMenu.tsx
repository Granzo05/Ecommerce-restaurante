import { useState } from 'react';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import ModalFlotante from '../ModalFlotante';
import { IngredienteMenu } from '../../types/Ingredientes/IngredienteMenu';
import { MenuService } from '../../services/MenuService';
import { ImagenesProducto } from '../../types/Productos/ImagenesProducto';
import { ArticuloMenu } from '../../types/Productos/ArticuloMenu';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import { Toaster, toast } from 'sonner'
import { EnumTipoArticuloComida } from '../../types/Productos/EnumTipoArticuloComida';
import AgregarIngrediente from '../Ingrediente/AgregarIngrediente';
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendaciones from '../ModalFlotanteRecomendaciones';
import { clearInputs } from '../../utils/global_variables/functions';
import '../../styles/modalCrud.css'

function AgregarMenu() {
  const [ingredientes, setIngredientes] = useState<IngredienteMenu[]>([]);
  const [imagenes, setImagenes] = useState<ImagenesProducto[]>([]);
  let [selectIndexImagenes, setSelectIndexImagenes] = useState<number>(0);
  let [selectIndexIngredientes, setSelectIndexIngredientes] = useState<number>(0);

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

      if (selectIndexImagenes > 0) {
        setSelectIndexImagenes(prevIndex => prevIndex - 1);
      }
    } else {
      const nuevasImagenes = [...imagenes];
      nuevasImagenes.pop();
      setImagenes(nuevasImagenes);
      setSelectIndexImagenes(0);
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
    if (ingredientes.length > 0) {
      const nuevosIngredientes = [...ingredientes];
      nuevosIngredientes.splice(index, 1);
      setIngredientes(ingredientes);

      if (selectIndexIngredientes > 0) {
        selectIndexIngredientes--;
      }
    } else {
      setIngredientes([]);
      setSelectIndexIngredientes(0);
    }
  };


  // Modal flotante de ingrediente
  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [elementosABuscar, setElementosABuscar] = useState<string>('');
  const [showAgregarIngredienteModal, setShowAgregarIngredienteModal] = useState(false);

  const handleSelectProduct = (product: string) => {
    setSelectedProduct(product);
  };

  const handleAbrirRecomendaciones = (busqueda: string) => {
    setElementosABuscar(busqueda)
    setModalBusqueda(true);
  };

  const handleAgregarIngrediente = () => {
    setShowAgregarIngredienteModal(true);
  };

  const handleModalClose = () => {
    setShowAgregarIngredienteModal(false);
    setModalBusqueda(false)
    if (selectedProduct) {
      handleNombreIngredienteChange(selectIndexIngredientes, selectedProduct);
    }
  };

  const [tiempoCoccion, setTiempo] = useState(0);
  const [tipo, setTipo] = useState<EnumTipoArticuloComida | string>('');
  const [comensales, setComensales] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  async function agregarMenu() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!tiempoCoccion) {
      toast.error("Por favor, es necesaria el tiempo de cocción");
      return;
    } else if (!comensales) {
      toast.error("Por favor, es necesaria la cantidad de comensales comensales");
      return;
    } else if (!precio) {
      toast.error("Por favor, es necesario el precio");
      return;
    } else if (!tipo) {
      toast.error("Por favor, es necesario el tipo");
      return;
    } else if (imagenes.length === 0) {
      toast.info("No se asignó ninguna imagen");
      return;
    } else if (!descripcion) {
      toast.error("Por favor, es necesario la descripción");
      return;
    }

    for (let i = 0; i < ingredientes.length; i++) {
      const ingrediente = ingredientes[i].ingrediente;
      const cantidad = ingredientes[i].cantidad;
      const medida = ingredientes[i].medida;

      if (!ingrediente?.nombre || cantidad === 0 || !medida) {
        toast.info("Por favor, los ingredientes deben contener todos los campos");
        return;
      }
    }

    const menu: ArticuloMenu = new ArticuloMenu();

    menu.nombre = nombre;
    menu.tiempoCoccion = tiempoCoccion;
    menu.tipo = tipo;
    menu.comensales = comensales;
    menu.precioVenta = precio;
    menu.descripcion = descripcion;
    menu.ingredientesMenu = ingredientes;
    menu.borrado = 'NO';
    toast.promise(MenuService.createMenu(menu, imagenes), {
      loading: 'Creando menu...',
      success: (message) => {
        clearInputs();
        setSelectIndexIngredientes(0);
        setSelectIndexImagenes(0);
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <h2>Agregar menú</h2>
      <Toaster />
      <div>

        {imagenes.map((imagen, index) => (

          <div className='inputBox' key={index}>
            <p className='cierre-ingrediente' onClick={quitarCampoImagen}>X</p>
            <input
              type="file"
              accept="image/*"
              maxLength={10048576}
              onChange={(e) => handleImagen(index, e.target.files?.[0] ?? null)}

            />

          </div>
        ))}
      </div>
      <button onClick={añadirCampoImagen}>Añadir imagen</button>

      <div className="inputBox">
        <hr />
        <input type="text" required={true} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del menu</span>
      </div>
      <div className="inputBox">
        <input type="text" required={true} onChange={(e) => { setDescripcion(e.target.value) }} />
        <span>Descripción del menu</span>
      </div>

      <div className="inputBox">
        <input type="number" required={true} onChange={(e) => { setTiempo(parseInt(e.target.value)) }} />
        <span>Minutos de coccion</span>
      </div>

      <label>
        <div className="inputBox">
          <select id="tipoMenu" name="tipoMenu" onChange={(e) => { setTipo(e.target.value) }} defaultValue="">
            <option value="" disabled hidden>Seleccionar tipo de menú</option>
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

        </div>
      </label>
      <div className="inputBox">
        <input type="number" required={true} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
        <span>Precio</span>
      </div>
      <div className="inputBox">
        <input type="number" required={true} onChange={(e) => { setComensales(parseFloat(e.target.value)) }} />
        <span>Comensales</span>
        <hr />
      </div>
      <div>
        <h2>Ingredientes</h2>

        <ModalFlotante isOpen={showAgregarIngredienteModal} onClose={handleModalClose}>
          <AgregarIngrediente />
        </ModalFlotante>
        {ingredientes.map((ingredienteMenu, index) => (
          <div key={index}>
            <hr />
            <p className='cierre-ingrediente' onClick={() => quitarCampoIngrediente(index)}>X</p>
            <div>
            <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>

              <InputComponent placeHolder='Filtrar ingrediente...' onInputClick={() => handleAbrirRecomendaciones('INGREDIENTES')} selectedProduct={ingredienteMenu.ingrediente?.nombre ?? ''} />
              {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputDepartamento='' inputProvincia='' />}
            </div>
            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => handleCantidadIngredienteChange(index, parseFloat(e.target.value))} />
              <span>Cantidad necesaria</span>
            </div>
            <div className="inputBox">
              <select
                id={`select-medidas-${index}`}
                onChange={(e) => handleMedidaIngredienteChange(index, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled hidden>Seleccionar medida ingrediente</option>
                <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
                <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
                <option value={EnumMedida.LITROS.toString()}>Litros</option>
                <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
                <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
              </select>
            </div>
          </div>
        ))}

      </div>
      <button onClick={añadirCampoIngrediente}>Añadir ingrediente</button>

      <br />
      <button onClick={() => handleAgregarIngrediente()}>Cargar nuevo ingrediente</button>


      <hr />
      <button type="button" onClick={agregarMenu}>Agregar menu</button>
    </div >
  )
}

export default AgregarMenu
