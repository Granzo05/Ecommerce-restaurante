import { useState } from 'react';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import ModalFlotante from '../ModalFlotante';
import { IngredienteMenu } from '../../types/Ingredientes/IngredienteMenu';
import { MenuService } from '../../services/MenuService';
import { Imagenes } from '../../types/Productos/Imagenes';
import { ArticuloMenu } from '../../types/Productos/ArticuloMenu';
import { Toaster, toast } from 'sonner'
import AgregarIngrediente from '../Ingrediente/AgregarIngrediente';
import InputComponent from '../InputFiltroComponent';
import '../../styles/modalCrud.css'
import ModalFlotanteRecomendacionesMedidas from '../../hooks/ModalFlotanteFiltroMedidas';
import ModalFlotanteRecomendacionesCategoria from '../../hooks/ModalFlotanteFiltroCategorias';
import { Medida } from '../../types/Ingredientes/Medida';
import { Categoria } from '../../types/Ingredientes/Categoria';
import ModalFlotanteRecomendacionesIngredientes from '../../hooks/ModalFlotanteFiltroIngredientes';
import AgregarCategoria from '../Categorias/AgregarCategoria';
import AgregarSubcategoria from '../Subcategorias/AgregarSubcategoria';
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import ModalFlotanteRecomendacionesSubcategoria from '../../hooks/ModalFlotanteFiltroSubcategorias';

function AgregarMenu() {
  const [ingredientes, setIngredientes] = useState<IngredienteMenu[]>([]);
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [subcategoria, setSubcategoria] = useState<Subcategoria>(new Subcategoria());

  const handleImagen = (index: number, file: File | null) => {
    if (file) {
      const newImagenes = [...imagenes];
      newImagenes[index] = { ...newImagenes[index], file };
      setImagenes(newImagenes);
    }
  };

  const añadirCampoImagen = () => {
    setImagenes([...imagenes, { index: imagenes.length, file: null } as Imagenes]);
  };

  const quitarCampoImagen = () => {
    if (imagenes.length > 0) {
      const nuevasImagenes = [...imagenes];
      nuevasImagenes.pop();
      setImagenes(nuevasImagenes);
    } else {
      setImagenes([]);
    }
  };

  // Ingredientes
  const handleIngredienteChange = (index: number, ingrediente: Ingrediente) => {
    const nuevosIngredientes = [...ingredientes];
    if (nuevosIngredientes && nuevosIngredientes[index].ingrediente) {
      nuevosIngredientes[index].ingrediente = ingrediente;
      setIngredientes(nuevosIngredientes);
    }
  };

  const handleCantidadIngredienteChange = (index: number, cantidad: number) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index].cantidad = cantidad;
    setIngredientes(nuevosIngredientes);
  };

  const handleMedidaIngredienteChange = (index: number, medida: Medida) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index].medida = medida;
    setIngredientes(nuevosIngredientes);
  };

  const añadirCampoIngrediente = () => {
    // SI no hay ingredientes que genere en valor 0 de index
    if (ingredientes.length === 0) {
      setIngredientes([...ingredientes, { id: 0, ingrediente: new Ingrediente(), cantidad: 0, medida: new Medida(), articuloMenu: new ArticuloMenu(), borrado: 'NO' }]);
    } else {
      setIngredientes([...ingredientes, { id: 0, ingrediente: new Ingrediente(), cantidad: 0, medida: new Medida(), articuloMenu: new ArticuloMenu(), borrado: 'NO' }]);
    }
  };

  const quitarCampoIngrediente = (index: number) => {
    if (ingredientes.length > 0) {
      const nuevosIngredientes = [...ingredientes];
      nuevosIngredientes.splice(index, 1);
      setIngredientes(nuevosIngredientes);
    } else {
      setIngredientes([]);
    }
  };


  // Modal flotante de ingrediente
  const [modalBusquedaCategoria, setModalBusquedaCategoria] = useState<boolean>(false);
  const [modalBusquedaSubcategoria, setModalBusquedaSubcategoria] = useState<boolean>(false);
  const [modalBusquedaMedida, setModalBusquedaMedida] = useState<boolean>(false);
  const [modalBusquedaIngrediente, setModalBusquedaIngrediente] = useState<boolean>(false);
  const [showAgregarIngredienteModal, setShowAgregarIngredienteModal] = useState(false);
  const [showAgregarSubcategoriaModal, setShowAgregarSubcategoriaModal] = useState(false);
  const [showAgregarCategoriaModal, setShowAgregarCategoriaModal] = useState(false);


  const handleModalClose = () => {
    setShowAgregarIngredienteModal(false);
    setModalBusquedaCategoria(false)
    setModalBusquedaMedida(false)
    setModalBusquedaIngrediente(false)
    setShowAgregarCategoriaModal(false)
    setShowAgregarSubcategoriaModal(false)
    setModalBusquedaSubcategoria(false)
  };

  const handleSubcategoria = (subcategoria: Subcategoria) => {
    setSubcategoria(subcategoria);

    categoria.subcategorias.push(subcategoria);
  };

  const [tiempoCoccion, setTiempo] = useState(0);
  const [categoria, setCategoria] = useState<Categoria>(new Categoria());
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
    } else if (!categoria) {
      toast.error("Por favor, es necesario la categoria");
      return;
    } else if (imagenes.length === 0) {
      toast.info("No se asignó ninguna imagen");
      return;
    } else if (!descripcion) {
      toast.error("Por favor, es necesario la descripción");
      return;
    } else if (!subcategoria) {
      toast.error("Por favor, es necesaria una subcategoria");
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
    menu.categoria = categoria;
    menu.subcategoria = subcategoria;
    menu.comensales = comensales;
    menu.precioVenta = precio;
    menu.descripcion = descripcion;
    menu.ingredientesMenu = ingredientes;
    menu.borrado = 'NO';
    
    toast.promise(MenuService.createMenu(menu, imagenes), {
      loading: 'Creando menu...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  //SEPARAR EN PASOS
  const [step, setStep] = useState(1);

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

  const renderStep = () => {
    switch(step){
      case 1:
        return(
          <>
          </>
        );
    }
  }

  return (
    <div className="modal-info">
      <h2>&mdash; Agregar menú &mdash;</h2>
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
      <div>
      <label style={{ display: 'flex', fontWeight: 'bold' }}>Categoría:</label>
        <InputComponent placeHolder={'Filtrar categorias...'} onInputClick={() => setModalBusquedaCategoria(true)} selectedProduct={categoria.nombre ?? ''} />
        {modalBusquedaCategoria && <ModalFlotanteRecomendacionesCategoria onCloseModal={handleModalClose} onSelectCategoria={(categoria) => { setCategoria(categoria); handleModalClose(); }} />}
      
      </div>
      
      
      <div>
      <label style={{ display: 'flex', fontWeight: 'bold' }}>Subcategoría:</label>
        <InputComponent placeHolder={'Filtrar subcategorias...'} onInputClick={() => setModalBusquedaSubcategoria(true)} selectedProduct={subcategoria.nombre ?? ''} />
        {modalBusquedaSubcategoria && <ModalFlotanteRecomendacionesSubcategoria onCloseModal={handleModalClose} onSelectSubcategoria={(subcategoria) => { handleSubcategoria(subcategoria); handleModalClose(); }} categoria={categoria} />}
      </div>
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
              <InputComponent placeHolder='Filtrar ingrediente...' onInputClick={() => setModalBusquedaIngrediente(true)} selectedProduct={ingredientes[index].ingrediente?.nombre ?? ''} />
              {modalBusquedaIngrediente && <ModalFlotanteRecomendacionesIngredientes onCloseModal={handleModalClose} onSelectIngrediente={(ingrediente) => { handleIngredienteChange(index, ingrediente); handleModalClose() }} />}
            </div>
            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => handleCantidadIngredienteChange(index, parseFloat(e.target.value))} />
              <span>Cantidad necesaria</span>
            </div>
            <div className="input-filtrado">
              <InputComponent placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={ingredientes[index].medida?.nombre ?? ''} />
              {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedidaIngredienteChange(index, medida); handleModalClose(); }} />}
            </div>
          </div>
        ))}

      </div>
      <button onClick={añadirCampoIngrediente}>Añadir ingrediente</button>

      <br />
      <button onClick={() => setShowAgregarIngredienteModal(true)}>Cargar nuevo ingrediente</button>

      <hr />
      <button type="button" onClick={agregarMenu}>Agregar menu</button>
    </div >
  )
}

export default AgregarMenu
