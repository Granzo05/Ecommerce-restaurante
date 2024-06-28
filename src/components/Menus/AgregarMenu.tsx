import { useEffect, useState } from 'react';
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
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Empresa } from '../../types/Restaurante/Empresa';
import { StockIngredientesService } from '../../services/StockIngredientesService';

interface AgregarMenuProps {
  onCloseModal: () => void;
}


const AgregarMenu: React.FC<AgregarMenuProps> = ({ onCloseModal }) => {
  const [ingredientesMenu, setIngredientes] = useState<IngredienteMenu[]>([]);
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [subcategoria, setSubcategoria] = useState<Subcategoria | null>();
  const [precioSugerido, setPrecioSugerido] = useState<number>(0);
  const [nombresIngredientes, setNombresIngredientes] = useState<string[]>([]);

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
    if (nuevosIngredientes[index] && nuevosIngredientes[index].ingrediente) {
      nuevosIngredientes[index].ingrediente = ingrediente;
      setIngredientes(nuevosIngredientes);

      const nuevosNombresIngredientes = [...nombresIngredientes];
      nuevosNombresIngredientes[index] = ingrediente.nombre;
      setNombresIngredientes(nuevosNombresIngredientes);
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

  const quitarCampoIngrediente = (nombreIngrediente: string, index: number) => {
    const nuevosNombres = nombresIngredientes.filter(nombre => nombre !== nombreIngrediente);
    setNombresIngredientes(nuevosNombres);

    if (ingredientesMenu.length > 0) {
      const nuevosIngredientes = [...ingredientesMenu];
      nuevosIngredientes.splice(index, 1);
      setIngredientes(nuevosIngredientes);
    } else {
      setIngredientes([]);
    }
  };

  async function calcularCostos() {
    let precioRecomendado: number = 0;

    for (const ingredienteMenu of ingredientesMenu) {
      if (ingredienteMenu.ingrediente?.nombre.length > 0) {

        let stock = await StockIngredientesService.getStockPorProducto(ingredienteMenu.ingrediente.nombre);

        if ((stock.medida.nombre === 'KILOGRAMOS' && ingredienteMenu.medida.nombre === 'GRAMOS') || (stock.medida.nombre === 'LITROS' && ingredienteMenu.medida.nombre === 'CENTIMETROS_CUBICOS')) {
          // Si no coinciden, se necesita ajustar la cantidad a la medida del stock
          precioRecomendado += (stock.precioCompra * (ingredienteMenu.cantidad) / 1000);
        } else {
          precioRecomendado += stock.precioCompra * ingredienteMenu.cantidad;
        }
      }
    }
    setPrecioSugerido(precioRecomendado);
  }

  const [empresa] = useState<Empresa | null>(() => {
    const empresaString = localStorage.getItem('empresa');

    return empresaString ? (JSON.parse(empresaString) as Empresa) : null;
  });

  const [idsSucursalesElegidas, setIdsSucursalesElegidas] = useState<Set<number>>(new Set<number>());
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
    SucursalService.getSucursales()
      .then(data => {
        setSucursales(data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleSucursalesElegidas = (sucursalId: number) => {
    const updatedSelectedSucursales = new Set(idsSucursalesElegidas);
    if (updatedSelectedSucursales.has(sucursalId)) {
      updatedSelectedSucursales.delete(sucursalId);
    } else {
      updatedSelectedSucursales.add(sucursalId);
    }
    setIdsSucursalesElegidas(updatedSelectedSucursales);
  };

  const marcarSucursales = () => {
    setIdsSucursalesElegidas(new Set(sucursales.map(sucursal => sucursal.id)));
  };

  const desmarcarSucursales = () => {
    setIdsSucursalesElegidas(new Set());
  };


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

  const [tiempoCoccion, setTiempo] = useState(parseInt(''));
  const [categoria, setCategoria] = useState<Categoria>(new Categoria());
  const [comensales, setComensales] = useState(parseInt(''));
  const [precio, setPrecio] = useState(parseInt(''));
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [isLoading, setIsLoading] = useState(false);

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
    } else if (!precio || precio == 0) {
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
    setIsLoading(true);

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

    let sucursalesElegidas: Sucursal[] = [];

    idsSucursalesElegidas.forEach(idSucursal => {
      let sucursal: Sucursal = new Sucursal();
      sucursal.id = idSucursal;
      sucursalesElegidas.push(sucursal);
    });

    menu.sucursales = sucursalesElegidas;

    menu.ganancia = precio - precioSugerido;
   
    toast.promise(MenuService.createMenu(menu, imagenes), {
      loading: 'Creando menu...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return message;
      },
      error: (message) => {
        return message;
      },
      finally: () => {
        setIsLoading(false);
      }
    });
 
  }

  //SEPARAR EN PASOS
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (step === 4)
      calcularCostos();
  }, [step]);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateAndNextStep = () => {

    if (!nombre || !nombre.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\(\)\,]+$/)) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!descripcion || !descripcion.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\(\)\,]+$/)) {
      toast.error("Por favor, es necesario una descripcion");
      return;
    } else if (!tiempoCoccion || tiempoCoccion == 0) {
      toast.error("Por favor, es necesaria el tiempo de cocción y que no sea 0");
      return;
    } else if (!comensales || comensales == 0) {
      toast.error("Por favor, es necesaria la cantidad de comensales y que no sea 0");
      return;
    } else if (!categoria || categoria.nombre == '') {
      toast.error("Por favor, es necesaria la categoria");
      return;
    } else if (!subcategoria || subcategoria.nombre == '') {
      toast.error("Por favor, es necesaria la subcategoria");
      return;
    } else {
      nextStep();
    }
  }

  const validateAndNextStep2 = () => {

    for (let i = 0; i < ingredientesMenu.length; i++) {
      const ingrediente = ingredientesMenu[i].ingrediente;
      const medida = ingredientesMenu[i].medida;
      const cantidad = ingredientesMenu[i].cantidad;

      if (!ingrediente || ingrediente.nombre == '') {
        toast.info(`Por favor, el ingrediente ${i + 1} debe contener un ingrediente`);
        return;
      } else if (!medida || medida.nombre == '') {
        toast.info(`Por favor, el ingrediente ${i + 1} debe contener una unidad de medida`);
        return;
      } else if (!cantidad || (cantidad <= 0)) {
        toast.info(`Por favor, el ingrediente ${i + 1} debe contener una cantidad válida y no debe ser 0`);
        return;
      }
    }

    if (ingredientesMenu) {
      nextStep();
    }
  }

  const validateAndNextStep3 = () => {
    if (imagenes.length === 0) {
      toast.info("No se asignó ninguna imagen");
      return;
    } else {
      nextStep();
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4>Paso 1 - Datos</h4>
            <div className="inputBox">
              <input type="text" pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\(\)\,]+" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
              <span>Nombre del menú</span>
              <div className="error-message">El nombre debe contener letras y espacios.</div>
            </div>
            <div className="inputBox">
              <input type="text" required={true} pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\(\)\,]+" value={descripcion} onChange={(e) => { setDescripcion(e.target.value) }} />
              <span>Descripción del menu</span>
              <div className="error-message">La descripción debe contener letras y espacios.</div>
            </div>

            <div className="inputBox">
              <input type="number" pattern="^[1-9]\d*$" required={true} value={tiempoCoccion} onChange={(e) => { setTiempo(parseInt(e.target.value)) }} />
              <span>Minutos de coccion</span>
              <div className="error-message">Los minutos de cocción solo deben contener números.</div>

            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Categoría:</label>
              <InputComponent disabled={false} placeHolder={'Filtrar categorias...'} onInputClick={() => setModalBusquedaCategoria(true)} selectedProduct={categoria?.nombre ?? ''} />
              {modalBusquedaCategoria && <ModalFlotanteRecomendacionesCategoria datosOmitidos={categoria?.nombre} onCloseModal={handleModalClose} onSelectCategoria={(categoria) => { setCategoria(categoria); setSubcategoria(null); handleModalClose(); }} />}
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Subcategoría:</label>
              <InputComponent disabled={categoria.nombre.length === 0} placeHolder={'Filtrar subcategorias...'} onInputClick={() => setModalBusquedaSubcategoria(true)} selectedProduct={subcategoria?.nombre ?? ''} />
              {modalBusquedaSubcategoria && <ModalFlotanteRecomendacionesSubcategoria datosOmitidos={subcategoria?.nombre} onCloseModal={handleModalClose} onSelectSubcategoria={(subcategoria) => { handleSubcategoria(subcategoria); handleModalClose(); }} categoria={categoria} />}
            </div>
            <div className="inputBox">
              <input type="number" required={true} pattern="^[1-9]\d*$" value={comensales} onChange={(e) => { setComensales(parseFloat(e.target.value)) }} />
              <span>Comensales</span>
              <div className="error-message">La cantidad de comensales solo debe contener números.</div>

              <hr />
            </div>
            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={validateAndNextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Paso 2 - Agregar ingrediente al menú</h4>
            <div>
              <ModalCrud isOpen={showAgregarIngredienteModal} onClose={handleModalClose}>
                <AgregarIngrediente onCloseModal={handleModalClose} />
              </ModalCrud>
              {ingredientesMenu.map((ingredienteMenu, index) => (
                <div key={index}>
                  <hr />
                  <p className='cierre-ingrediente' onClick={() => quitarCampoIngrediente(ingredienteMenu.ingrediente.nombre, index)}>X</p>
                  <h4 style={{ fontSize: '18px' }}>Ingrediente {index + 1}</h4>
                  <div>
                    <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>
                    <InputComponent disabled={false} placeHolder='Filtrar ingrediente...' onInputClick={() => setModalBusquedaIngrediente(true)} selectedProduct={ingredientesMenu[index].ingrediente?.nombre ?? ''} />
                    {modalBusquedaIngrediente && <ModalFlotanteRecomendacionesIngredientes datosOmitidos={nombresIngredientes} onCloseModal={handleModalClose} onSelectIngrediente={(ingrediente) => { handleIngredienteChange(index, ingrediente); handleModalClose() }} />}
                  </div>
                  <div className="inputBox">
                    <input type="number" required={true} pattern="^[1-9]\d*$" onChange={(e) => handleCantidadIngredienteChange(index, parseFloat(e.target.value))} />
                    <span>Cantidad necesaria</span>
                    <div className="error-message">La cantidad solo debe contener números.</div>

                  </div>
                  <div className="input-filtrado">
                    <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={ingredientesMenu[index].ingrediente?.medida?.nombre ?? ingredientesMenu[index].medida?.nombre ?? ''} />
                    {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={subcategoria?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedidaIngredienteChange(index, medida); handleModalClose(); }} />}
                  </div>
                </div>
              ))}

            </div>
            <button onClick={añadirCampoIngrediente}>Añadir ingrediente al menú</button>

            <br />
            <br />
            <div className='btns-pasos'>
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button style={{ marginRight: '10px' }} onClick={() => setShowAgregarIngredienteModal(true)}>Cargar nuevo ingrediente en el inventario (opcional)</button>

              <button className='btn-accion-adelante' onClick={validateAndNextStep2}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4>Paso 3 - Imagenes</h4>
            <div>
              {imagenes.map((imagen, index) => (
                <div key={index} className='inputBox'>
                  <hr />
                  <p className='cierre-ingrediente' onClick={() => quitarCampoImagen()}>X</p>
                  <h4 style={{ fontSize: '18px' }}>Imagen {index + 1}</h4>
                  <br />
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      id={`file-input-${index}`}
                      className="file-input"
                      onChange={(e) => handleImagen(index, e.target.files?.[0] ?? null)}
                    />
                    <label htmlFor={`file-input-${index}`} className="file-input-label">
                      {imagen.file ? (
                        <p>Archivo seleccionado: {imagen.file.name}</p>
                      ) : (
                        <p>Seleccionar un archivo</p>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={añadirCampoImagen}>Añadir imagen</button>
            <br />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={validateAndNextStep3}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h4>Paso final</h4>
            {precioSugerido !== undefined && precioSugerido > 0 && (
              <>
                <p>Costo por ingredientes: ${precioSugerido}</p>
                <div className="inputBox">
                  <input type="number" pattern="^[1-9]\d*$" min={-100} onChange={(e) => setPrecio((1 + parseInt(e.target.value) / 100) * precioSugerido)} />
                  <span>% de ganancia buscado</span>
                  <div className="error-message">Asigne un porcentaje válido que solo debe contener números.</div>

                </div>
              </>
            )}
            <div className="inputBox">
              <input
                type="number"
                step="0.01"
                min={0}
                required={true}
                value={precio}
                onChange={(e) => { setPrecio(parseFloat(e.target.value)) }}
              />
              <span>Precio final</span>
              <div className="error-message">Asigne un precio final que solo debe contener números.</div>
            </div>

            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              {empresa && empresa?.id > 0 ? (
                <button className='btn-accion-adelante' onClick={nextStep}>Seleccionar sucursales ⭢</button>
              ) : (
                <button className='btn-accion-completar' onClick={agregarMenu} disabled={isLoading}>
                  {isLoading ? 'Cargando...' : 'Agregar menú ✓'}
                </button>)}
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h4>Sucursales</h4>
            {sucursales && sucursales.map((sucursal, index) => (
              <div key={index}>
                <>
                  <hr />
                  <p className='cierre-ingrediente' onClick={() => desmarcarSucursales()}>Desmarcar todas</p>
                  <p className='cierre-ingrediente' onClick={() => marcarSucursales()}>Marcar todas</p>
                  <h4 style={{ fontSize: '18px' }}>Sucursal: {sucursal.nombre}</h4>
                  <input
                    type="checkbox"
                    value={sucursal.id}
                    checked={idsSucursalesElegidas.has(sucursal.id) || false}
                    onChange={() => handleSucursalesElegidas(sucursal.id)}
                  />
                  <label>{sucursal.nombre}</label>
                </>
              </div>
            ))}
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-completar' onClick={agregarMenu} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Agregar menú ✓'}
              </button>
            </div>
          </>
        );
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
