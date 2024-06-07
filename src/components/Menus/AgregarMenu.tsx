import { useState } from 'react';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
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
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import ModalFlotanteRecomendacionesSubcategoria from '../../hooks/ModalFlotanteFiltroSubcategorias';
import ModalCrud from '../ModalCrud';

function AgregarMenu() {
  const [ingredientesMenu, setIngredientes] = useState<IngredienteMenu[]>([]);
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [subcategoria, setSubcategoria] = useState<Subcategoria>(new Subcategoria());
  const [precioSugerido, setPrecioSugerido] = useState<number>(0);

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
    const nuevosIngredientes = [...ingredientesMenu];
    if (nuevosIngredientes && nuevosIngredientes[index].ingrediente) {
      nuevosIngredientes[index].ingrediente = ingrediente;
      setIngredientes(nuevosIngredientes);
    }
  };

  const handleCantidadIngredienteChange = (index: number, cantidad: number) => {
    const nuevosIngredientes = [...ingredientesMenu];
    nuevosIngredientes[index].cantidad = cantidad;
    setIngredientes(nuevosIngredientes);
  };

  const handleMedidaIngredienteChange = (index: number, medida: Medida) => {
    const nuevosIngredientes = [...ingredientesMenu];
    nuevosIngredientes[index].medida = medida;
    setIngredientes(nuevosIngredientes);
  };

  const añadirCampoIngrediente = () => {
    // SI no hay ingredientesMenu que genere en valor 0 de index
    if (ingredientesMenu.length === 0) {
      setIngredientes([...ingredientesMenu, { id: 0, ingrediente: new Ingrediente(), cantidad: 0, medida: new Medida(), articuloMenu: new ArticuloMenu(), borrado: 'NO' }]);
    } else {
      setIngredientes([...ingredientesMenu, { id: 0, ingrediente: new Ingrediente(), cantidad: 0, medida: new Medida(), articuloMenu: new ArticuloMenu(), borrado: 'NO' }]);
    }
  };

  const quitarCampoIngrediente = (index: number) => {
    if (ingredientesMenu.length > 0) {
      const nuevosIngredientes = [...ingredientesMenu];
      nuevosIngredientes.splice(index, 1);
      setIngredientes(nuevosIngredientes);
    } else {
      setIngredientes([]);
    }
  };

  function calcularCostos() {
    let precioRecomendado: number = 0;
    console.log(ingredientesMenu)
    if (ingredientesMenu[0].ingrediente?.nombre?.length > 0 && precioSugerido === 0) {
      ingredientesMenu.forEach(ingredienteMenu => {
        if (ingredienteMenu.medida?.nombre === ingredienteMenu.ingrediente?.stockIngrediente?.medida?.nombre) {
          // Si coinciden las medidas, ej gramos y gramos entonces se calcula por igual
          precioRecomendado += ingredienteMenu?.ingrediente?.stockIngrediente?.precioCompra * ingredienteMenu?.cantidad;
        } else if (ingredienteMenu?.medida?.nombre !== ingredienteMenu?.ingrediente?.stockIngrediente?.medida?.nombre && ingredienteMenu?.ingrediente?.stockIngrediente?.precioCompra) {
          // Si no coinciden entonces hay que llevar la medida al mimso tipo ya que el precio se calcula por unidad de medida del stock
          precioRecomendado += (ingredienteMenu?.ingrediente?.stockIngrediente?.precioCompra * ingredienteMenu?.cantidad) / 1000;
        }
      });

      setPrecioSugerido(precioRecomendado);
    }
  }


  // Modal flotante de ingrediente
  const [modalBusquedaCategoria, setModalBusquedaCategoria] = useState<boolean>(false);
  const [modalBusquedaSubcategoria, setModalBusquedaSubcategoria] = useState<boolean>(false);
  const [modalBusquedaMedida, setModalBusquedaMedida] = useState<boolean>(false);
  const [modalBusquedaIngrediente, setModalBusquedaIngrediente] = useState<boolean>(false);
  const [showAgregarIngredienteModal, setShowAgregarIngredienteModal] = useState(false);

  const handleModalClose = () => {
    setShowAgregarIngredienteModal(false);
    setModalBusquedaCategoria(false)
    setModalBusquedaMedida(false)
    setModalBusquedaIngrediente(false)
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

    for (let i = 0; i < ingredientesMenu.length; i++) {
      const ingrediente = ingredientesMenu[i].ingrediente;
      const cantidad = ingredientesMenu[i].cantidad;
      const medida = ingredientesMenu[i].medida;

      if (!ingrediente?.nombre || cantidad === 0 || !medida) {
        toast.info("Por favor, los ingredientesMenu deben contener todos los campos");
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
    menu.ingredientesMenu = ingredientesMenu;
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
    calcularCostos();
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4>Paso 1 - Datos</h4>
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
              <InputComponent disabled={false} placeHolder={'Filtrar categorias...'} onInputClick={() => setModalBusquedaCategoria(true)} selectedProduct={categoria.nombre ?? ''} />
              {modalBusquedaCategoria && <ModalFlotanteRecomendacionesCategoria onCloseModal={handleModalClose} onSelectCategoria={(categoria) => { setCategoria(categoria); handleModalClose(); }} />}
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Subcategoría:</label>
              <InputComponent disabled={false} placeHolder={'Filtrar subcategorias...'} onInputClick={() => setModalBusquedaSubcategoria(true)} selectedProduct={subcategoria.nombre ?? ''} />
              {modalBusquedaSubcategoria && <ModalFlotanteRecomendacionesSubcategoria onCloseModal={handleModalClose} onSelectSubcategoria={(subcategoria) => { handleSubcategoria(subcategoria); handleModalClose(); }} categoria={categoria} />}
            </div>
            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => { setComensales(parseFloat(e.target.value)) }} />
              <span>Comensales</span>
              <hr />
            </div>
            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Paso 2 - Agregar ingrediente al menú</h4>
            <div>
              <ModalCrud isOpen={showAgregarIngredienteModal} onClose={handleModalClose}>
                <AgregarIngrediente />
              </ModalCrud>
              {ingredientesMenu.map((ingredienteMenu, index) => (
                <div key={index}>
                  <hr />
                  <p className='cierre-ingrediente' onClick={() => quitarCampoIngrediente(index)}>X</p>
                  <h4 style={{ fontSize: '18px' }}>Ingrediente {index + 1}</h4>
                  <div>
                    <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>
                    <InputComponent disabled={false} placeHolder='Filtrar ingrediente...' onInputClick={() => setModalBusquedaIngrediente(true)} selectedProduct={ingredientesMenu[index].ingrediente?.nombre ?? ''} />
                    {modalBusquedaIngrediente && <ModalFlotanteRecomendacionesIngredientes onCloseModal={handleModalClose} onSelectIngrediente={(ingrediente) => { handleIngredienteChange(index, ingrediente); handleModalClose() }} />}
                  </div>
                  <div className="inputBox">
                    <input type="number" required={true} onChange={(e) => handleCantidadIngredienteChange(index, parseFloat(e.target.value))} />
                    <span>Cantidad necesaria</span>
                  </div>
                  <div className="input-filtrado">
                    <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={ingredientesMenu[index].medida?.nombre ?? ''} />
                    {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedidaIngredienteChange(index, medida); handleModalClose(); }} />}
                  </div>
                </div>
              ))}

            </div>
            <button onClick={añadirCampoIngrediente}>Añadir ingrediente al menú</button>

            <br />
            <button onClick={() => setShowAgregarIngredienteModal(true)}>Cargar nuevo ingrediente en el inventario</button>
            <br />
            <div className='btns-pasos'>
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4>Paso final</h4>
            {precioSugerido !== undefined && precioSugerido > 0 && (
              <>
                <p>Costo por ingredientes: ${precioSugerido}</p>
                <input type="number" placeholder='% de ganancia buscado' onChange={(e) => setPrecio((1 + parseInt(e.target.value) / 100) * precioSugerido)} />
              </>
            )}
            <div className="inputBox">
              <input type="number" required={true} value={precio | 0} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
              <span>Precio</span>
            </div>

            <div>
              {imagenes.map((imagen, index) => (
                <div className='inputBox' key={index}>
                  <hr />
                  <p className='cierre-ingrediente' onClick={quitarCampoImagen}>X</p>
                  <h4 style={{ fontSize: '18px' }}>Imagen {index + 1}</h4>
                  <br />
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
            <br />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-completar' onClick={agregarMenu}>Agregar menú ✓</button>

            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="modal-info">
      <h2>&mdash; Agregar menú &mdash;</h2>
      <Toaster />
      {renderStep()}
      <hr />
    </div >
  )
}

export default AgregarMenu
