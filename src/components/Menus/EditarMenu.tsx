import { useEffect, useState } from 'react';
import { IngredienteMenu } from '../../types/Ingredientes/IngredienteMenu';
import { MenuService } from '../../services/MenuService';
import ModalFlotante from '../ModalFlotante';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import { Imagenes } from '../../types/Productos/Imagenes';
import { Toaster, toast } from 'sonner'
import './editarMenu.css'
import AgregarIngrediente from '../Ingrediente/AgregarIngrediente';
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendacionesMedidas from '../../hooks/ModalFlotanteFiltroMedidas';
import ModalFlotanteRecomendacionesIngredientes from '../../hooks/ModalFlotanteFiltroIngredientes';
import { Categoria } from '../../types/Ingredientes/Categoria';
import ModalFlotanteRecomendacionesCategoria from '../../hooks/ModalFlotanteFiltroCategorias';
import { Medida } from '../../types/Ingredientes/Medida';
import { ArticuloMenu } from '../../types/Productos/ArticuloMenu';
import ModalFlotanteRecomendacionesSubcategoria from '../../hooks/ModalFlotanteFiltroSubcategorias';
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Empresa } from '../../types/Restaurante/Empresa';

interface EditarMenuProps {
  menuOriginal: ArticuloMenu;
  onCloseModal: () => void;
}

const EditarMenu: React.FC<EditarMenuProps> = ({ menuOriginal, onCloseModal }) => {
  const [ingredientes, setIngredientes] = useState<IngredienteMenu[]>([]);
  const [ingredientesMuestra, setIngredientesMuestra] = useState<IngredienteMenu[]>(menuOriginal.ingredientesMenu);
  let [selectIndexIngredientes, setSelectIndexIngredientes] = useState<number>(0);
  const [imagenesMuestra, setImagenesMuestra] = useState<Imagenes[]>(menuOriginal.imagenes);
  const [imagenesEliminadas, setImagenesEliminadas] = useState<Imagenes[]>([]);
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const [tiempoCoccion, setTiempo] = useState(menuOriginal.tiempoCoccion);
  const [categoria, setCategoria] = useState<Categoria>(new Categoria());
  const [subcategoria, setSubcategoria] = useState<Subcategoria>(new Subcategoria());
  const [comensales, setComensales] = useState(menuOriginal.comensales);
  const [precioVenta, setPrecio] = useState(menuOriginal.precioVenta);
  const [nombre, setNombre] = useState(menuOriginal.nombre);
  const [descripcion, setDescripcion] = useState(menuOriginal.descripcion);

  const [nombresIngredientes, setNombresIngredientes] = useState<string[]>([]);

  useEffect(() => {
    setCategoria(menuOriginal.categoria);
    setSubcategoria(menuOriginal.subcategoria);
  }, [menuOriginal]);

  const handleImagen = (index: number, file: File | null) => {
    if (file) {
      const newImagenes = [...imagenes];
      newImagenes[index] = { ...newImagenes[index], file };
      setImagenes(newImagenes);
    }
  };

  const añadirCampoImagen = () => {
    let imagenNueva = new Imagenes();
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

  const handleMedidaIngredienteMostrableChange = (index: number, medida: Medida) => {
    const nuevosIngredientes = [...ingredientesMuestra];
    nuevosIngredientes[index].medida = medida;
    setIngredientesMuestra(nuevosIngredientes);
  };

  ///////// INGREDIENTES

  const handleIngredienteChange = (index: number, ingrediente: Ingrediente) => {
    const nuevosIngredientes = [...ingredientes];
    if (nuevosIngredientes && nuevosIngredientes[index].ingrediente) {
      nuevosIngredientes[index].ingrediente = ingrediente;
      setIngredientes(nuevosIngredientes);

      const nuevosNombresIngredientes = [...nombresIngredientes];
      nuevosNombresIngredientes[index] = ingrediente.nombre;
      setNombresIngredientes(nuevosNombresIngredientes);
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
  const [modalBusquedaCategoria, setModalBusquedaCategoria] = useState<boolean>(false);
  const [modalBusquedaMedida, setModalBusquedaMedida] = useState<boolean>(false);
  const [modalBusquedaIngrediente, setModalBusquedaIngrediente] = useState<boolean>(false);
  const [showAgregarIngredienteModal, setShowAgregarIngredienteModal] = useState(false);
  const [modalBusquedaSubcategoria, setModalBusquedaSubcategoria] = useState<boolean>(false);

  const handleAgregarIngrediente = () => {
    setShowAgregarIngredienteModal(true);
  };

  const handleModalClose = () => {
    setShowAgregarIngredienteModal(false);
    setModalBusquedaCategoria(false)
    setModalBusquedaMedida(false)
    setModalBusquedaIngrediente(false)
    setModalBusquedaSubcategoria(false)
  };

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
    } else if (!categoria) {
      toast.error("Por favor, es necesario el categoria");
      return;
    } else if (imagenes.length === 0 && imagenesMuestra.length === 0) {
      toast.info("No se asignó ninguna imagen");
      return;
    } else if (!descripcion) {
      toast.error("Por favor, es necesaria la descripción");
      return;
    }

    if (!categoria.subcategorias.find(sub => sub.nombre === subcategoria.nombre)) {
      toast.error("Por favor, la subcategoría no corresponde a esa categoría");
      return;
    }

    for (let i = 0; i < ingredientes.length; i++) {
      const ingrediente = ingredientes[i].ingrediente;
      const cantidad = ingredientes[i].cantidad;
      const medida = ingredientes[i].medida;
      console.log(ingredientes)
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

    let menuActualizado: ArticuloMenu = menuOriginal;

    menuActualizado.nombre = nombre;
    menuActualizado.tiempoCoccion = tiempoCoccion;
    menuActualizado.categoria = categoria;
    menuActualizado.comensales = comensales;
    menuActualizado.precioVenta = precioVenta;
    menuActualizado.descripcion = descripcion;
    menuActualizado.id = menuOriginal.id;
    menuActualizado.borrado = 'NO';
    menuActualizado.subcategoria = subcategoria;

    if (ingredientesMuestra.length > 0) {
      ingredientesMuestra.forEach(ingredienteDTO => {
        let ingredienteMenu: IngredienteMenu = new IngredienteMenu();

        ingredienteMenu.medida = ingredienteDTO.medida;
        ingredienteMenu.cantidad = ingredienteDTO.cantidad;
        ingredienteMenu.ingrediente = ingredienteDTO.ingrediente;

        menuActualizado.ingredientesMenu?.push(ingredienteMenu);
      });
    }

    if (ingredientes.length > 0) {
      ingredientes.forEach(ingredienteMenu => {
        menuActualizado.ingredientesMenu?.push(ingredienteMenu);
      });
    }

    let sucursalesElegidas: Sucursal[] = [];

    idsSucursalesElegidas.forEach(idSucursal => {
      let sucursal: Sucursal = new Sucursal();
      sucursal.id = idSucursal;
      sucursalesElegidas.push(sucursal);
    });

    menuActualizado.sucursales = sucursalesElegidas;

    toast.promise(MenuService.updateMenu(menuActualizado, imagenes, imagenesEliminadas), {
      loading: 'Editando menu...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  const [precioSugerido, setPrecioSugerido] = useState<number>(0);

  function calcularCostos() {
    let precioRecomendado: number = 0;
    if (ingredientes[0]?.ingrediente?.nombre?.length > 0 && precioSugerido === 0) {
      ingredientes.forEach(ingredienteMenu => {
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagenesMuestra.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagenesMuestra.length - 1 : prevIndex - 1
    );
  };
  //SEPARAR EN PASOS
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
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
            <div className="input-filtrado">
              <InputComponent disabled={false} placeHolder={'Filtrar categorias...'} onInputClick={() => setModalBusquedaCategoria(true)} selectedProduct={categoria?.nombre ?? ''} />
              {modalBusquedaCategoria && <ModalFlotanteRecomendacionesCategoria datosOmitidos={categoria?.nombre} onCloseModal={handleModalClose} onSelectCategoria={(categoria) => { setCategoria(categoria); handleModalClose(); }} />}
            </div>
            <div className="input-filtrado">
              <InputComponent disabled={false} placeHolder={'Filtrar subcategorias...'} onInputClick={() => setModalBusquedaSubcategoria(true)} selectedProduct={subcategoria?.nombre ?? ''} />
              {modalBusquedaSubcategoria && <ModalFlotanteRecomendacionesSubcategoria datosOmitidos={subcategoria?.nombre} onCloseModal={handleModalClose} onSelectSubcategoria={(subcategoria) => { setSubcategoria(subcategoria); handleModalClose(); }} categoria={categoria} />}
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={precioVenta} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
              <span>Precio</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={comensales} onChange={(e) => { setComensales(parseInt(e.target.value)) }} />
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
            <ModalFlotante isOpen={showAgregarIngredienteModal} onClose={handleModalClose}>
              <AgregarIngrediente onCloseModal={handleModalClose} />
            </ModalFlotante>
            {ingredientesMuestra.map((ingredienteMenu, index) => (
              <div key={index}>
                <hr />
                <p className='cierre-ingrediente' onClick={() => quitarCampoIngredienteMuestra(index)}>X</p>
                <div className="inputBox">
                  <input type="text" required={true} value={ingredienteMenu.ingrediente?.nombre} onChange={(e) => { setTiempo(parseInt(e.target.value)) }} />
                  <span>Nombre del ingrediente</span>
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={ingredienteMenu.cantidad} onChange={(e) => handleCantidadIngredienteMostrableChange(index, parseFloat(e.target.value))} />
                  <span>Cantidad necesaria</span>
                </div>
                <div className="input-filtrado">
                  <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={ingredienteMenu.ingrediente.medida?.nombre ?? ingredienteMenu.medida?.nombre ?? ''} />
                  {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={ingredienteMenu.medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedidaIngredienteMostrableChange(index, medida); handleModalClose(); }} />}
                </div>
              </div>
            ))}
            {ingredientes.map((ingredienteMenu, index) => (
              <div key={index}>
                <p className='cierre-ingrediente' onClick={() => quitarCampoIngrediente(index)}>X</p>
                <div>
                  <label style={{ display: 'flex', fontWeight: 'bold' }}>Nombre:</label>
                  <InputComponent disabled={false} placeHolder='Filtrar ingrediente...' onInputClick={() => setModalBusquedaIngrediente(true)} selectedProduct={ingredienteMenu.ingrediente?.nombre ?? ''} />
                  {modalBusquedaIngrediente && <ModalFlotanteRecomendacionesIngredientes datosOmitidos={nombresIngredientes} onCloseModal={handleModalClose} onSelectIngrediente={(ingrediente) => { handleIngredienteChange(index, ingrediente) }} />}
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={ingredienteMenu.cantidad} onChange={(e) => handleCantidadIngredienteChange(index, parseFloat(e.target.value))} />
                  <span>Cantidad necesaria</span>
                </div>
                <div className="input-filtrado">
                  <InputComponent disabled={false} placeHolder={'Filtrar unidades de medida...'} onInputClick={() => setModalBusquedaMedida(true)} selectedProduct={ingredienteMenu.ingrediente?.medida?.nombre ?? ''} />
                  {modalBusquedaMedida && <ModalFlotanteRecomendacionesMedidas datosOmitidos={ingredienteMenu.ingrediente?.medida?.nombre} onCloseModal={handleModalClose} onSelectMedida={(medida) => { handleMedidaIngredienteChange(index, medida); handleModalClose(); }} />}
                </div>
              </div>
            ))}
            <button onClick={() => handleAgregarIngrediente()}>Cargar nuevo ingrediente</button>
            <br />
            <button onClick={añadirCampoIngrediente}>Añadir ingrediente</button>
            <hr />
            <div className='btns-pasos'>
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4>Paso 3</h4>
            <div>
              <div className="slider-container">
                <button onClick={prevImage} className="slider-button prev">◀</button>
                <div className='imagenes-wrapper'>
                  {imagenesMuestra.map((imagen, index) => (
                    <div key={index} className={`imagen-muestra ${index === currentIndex ? 'active' : ''}`}>

                      <p className='cierre-ingrediente' onClick={() => handleEliminarImagen(index)}>X</p>
                      <label style={{ fontSize: '20px' }}>- Imagen {index + 1}</label>
                      {imagen && (

                        <img
                          src={imagen.ruta}
                          alt={`Imagen ${index}`}
                        />
                      )}
                    </div>
                  ))}
                  <button onClick={nextImage} className="slider-button next">▶</button>
                </div>
              </div>
              <br />
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
              <br />
              <button onClick={añadirCampoImagen}>Añadir imagen</button>
              <br />
              <div className="btns-pasos">
                <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
                <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
              </div>
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
                  <input type="number" onChange={(e) => setPrecio((1 + parseInt(e.target.value) / 100) * precioSugerido)} />
                  <span>% de ganancia buscado</span>
                </div>
              </>
            )}
            <div className="inputBox">
              <input type="number" required={true} value={precioVenta | 0} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
              <span>Precio final</span>
            </div>
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              {empresa && empresa?.id > 0 ? (
                <button className='btn-accion-adelante' onClick={nextStep}>Seleccionar sucursales ⭢</button>
              ) : (
                <button className='button-form' type='button' onClick={editarMenu}>Editar menu</button>
              )}
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
              <button className='button-form' type='button' onClick={editarMenu}>Editar menu</button>
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

export default EditarMenu
