import { useEffect, useState } from 'react';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Localidad } from '../../types/Domicilio/Localidad';
import { SucursalService } from '../../services/SucursalService';
import { Toaster, toast } from 'sonner'
import { LocalidadDelivery } from '../../types/Restaurante/LocalidadDelivery';
import InputComponent from '../InputFiltroComponent';
import { LocalidadService } from '../../services/LocalidadService';
import ModalFlotanteRecomendacionesProvincias from '../../hooks/ModalFlotanteFiltroProvincia';
import ModalFlotanteRecomendacionesDepartamentos from '../../hooks/ModalFlotanteFiltroDepartamentos';
import ModalFlotanteRecomendacionesLocalidades from '../../hooks/ModalFlotanteFiltroLocalidades';
import { DepartamentoService } from '../../services/DepartamentoService';
import { Departamento } from '../../types/Domicilio/Departamento';
import { Imagenes } from '../../types/Productos/Imagenes';
import ModalFlotanteRecomendacionesPais from '../../hooks/ModalFlotanteFiltroPais';

interface AgregarSucursalProps {
  onCloseModal: () => void;
}


const AgregarSucursal: React.FC<AgregarSucursalProps> = ({ onCloseModal }) => {
  // Atributos necesarios para Sucursal
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [calle, setCalle] = useState('');
  const [numeroCalle, setNumeroCalle] = useState(0);
  const [codigoPostal, setCodigoPostal] = useState(0);
  const [telefono, setTelefono] = useState(0);
  const [horarioApertura, setHorarioApertura] = useState('');
  const [horarioCierre, setHorarioCierre] = useState('');
  const [nombre, setNombre] = useState('');

  const [localidadesProvincia, setLocalidadesProvincia] = useState<Localidad[]>([]);

  const [localidadesMostrablesCheckbox, setLocalidadesMostrables] = useState<Localidad[]>([]);

  const [departamentosMostrablesCheckBox, setDepartamentosMostrablesCheckbox] = useState<Departamento[]>([]);

  const [idDepartamentosElegidos, setIdDepartamentosElegidos] = useState<Set<number>>(new Set<number>());

  const [idLocalidadesElegidas, setIdLocalidadesElegidas] = useState<Set<number>>(new Set<number>());

  const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);
  const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
  const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
  const [modalBusquedaPais, setModalBusquedaPais] = useState<boolean>(false);
  const [inputPais, setInputPais] = useState<string>('');
  const [inputProvincia, setInputProvincia] = useState<string>('');
  const [inputDepartamento, setInputDepartamento] = useState<string>('');
  const [localidadSucursal, setLocalidadSucursal] = useState<Localidad>(new Localidad());

  function buscarLocalidadesProvincia() {
    LocalidadService.getLocalidadesByNombreProvincia(inputProvincia)
      .then(async localidades => {
        setLocalidadesProvincia(localidades);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  useEffect(() => {
    if (inputProvincia.length > 0) {
      DepartamentoService.getDepartamentosByNombreProvincia(inputProvincia)
        .then(async departamentos => {
          setDepartamentosMostrablesCheckbox(departamentos);
        })
        .catch(error => {
          console.error('Error:', error);
        })
    }
  }, [inputProvincia]);

  const handleModalClose = () => {
    setModalBusquedaLocalidad(false)
    setModalBusquedaDepartamento(false)
    setModalBusquedaProvincia(false)
    setModalBusquedaPais(false)
  };

  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);

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

      if (selectIndex > 0) {
        setSelectIndex(prevIndex => prevIndex - 1);
      }
    }
  };


  // Paginacion de localidades

  const [paginaActualLocalidades, setPaginaActualLocalidades] = useState(1);
  const [cantidadLocalidadesMostrablesFiltradas, setCantidadLocalidadesMostrablesFiltrada] = useState(11);

  // Calcular el índice del primer y último elemento de la página actual
  const indexUltimaLocalidad = paginaActualLocalidades * cantidadLocalidadesMostrablesFiltradas;
  const indexPrimerLocalidad = indexUltimaLocalidad - cantidadLocalidadesMostrablesFiltradas;

  // Obtener los elementos de la página actual
  const [localidadesMostrablesCheckboxFiltradas, setLocalidadesMostrablesCheckboxFiltradas] = useState<Localidad[]>([]);

  const [paginasTotalesLocalidades, setPaginasTotalesLocalidades] = useState(1);

  // Cambiar de página
  const paginateLocalidades = (pagina: number) => setPaginaActualLocalidades(pagina);

  function cantidadMostradaLocalidades(cantidad: number) {
    setCantidadLocalidadesMostrablesFiltrada(cantidad);

    if (cantidad > localidadesMostrablesCheckbox.length) {
      setPaginasTotalesLocalidades(1);
      setLocalidadesMostrablesCheckboxFiltradas(localidadesMostrablesCheckbox);
    } else {
      setPaginasTotalesLocalidades(Math.ceil(localidadesMostrablesCheckbox.length / cantidad));
      setLocalidadesMostrablesCheckboxFiltradas(localidadesMostrablesCheckbox.slice(indexPrimerLocalidad, indexUltimaLocalidad));
    }
  }

  function filtrarLocalidades(filtro: string) {
    if (filtro.length > 0) {
      const filtradas = localidadesMostrablesCheckbox.filter(recomendacion =>
        recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())
      );
      setLocalidadesMostrablesCheckboxFiltradas(filtradas.length > 0 ? filtradas : []);
    } else {
      setLocalidadesMostrablesCheckboxFiltradas(localidadesMostrablesCheckbox.slice(indexPrimerLocalidad, indexUltimaLocalidad));
    }
  }

  useEffect(() => {
    if (localidadesMostrablesCheckbox.length > 0) {
      setLocalidadesMostrablesCheckboxFiltradas(localidadesMostrablesCheckbox.slice(indexPrimerLocalidad, indexUltimaLocalidad));
    }
  }, [localidadesMostrablesCheckbox, paginaActualLocalidades, cantidadLocalidadesMostrablesFiltradas]);




  // Paginación de departamentos
  const [paginaActualDepartamentos, setPaginaActualDepartamentos] = useState(1);
  const [cantidadDepartamentosMostrablesFiltrada, setCantidadDepartamentosMostrablesFiltrada] = useState(11);

  const indexUltimaDepartamento = paginaActualDepartamentos * cantidadDepartamentosMostrablesFiltrada;
  const indexPrimerDepartamento = indexUltimaDepartamento - cantidadDepartamentosMostrablesFiltrada;

  const [paginasTotalesDepartamentos, setPaginasTotalesDepartamentos] = useState(1);

  const paginateDepartamentos = (pagina: number) => setPaginaActualDepartamentos(pagina);

  const [departamentosMostrablesCheckboxFiltradas, setDepartamentosMostrablesCheckboxFiltradas] = useState<Departamento[]>([]);

  function cantidadMostradaDepartamentos(cantidad: number) {
    setCantidadDepartamentosMostrablesFiltrada(cantidad);

    if (cantidad > departamentosMostrablesCheckBox.length) {
      setPaginasTotalesDepartamentos(1);
      setDepartamentosMostrablesCheckboxFiltradas(departamentosMostrablesCheckBox);
    } else {
      setPaginasTotalesDepartamentos(Math.ceil(departamentosMostrablesCheckBox.length / cantidad));
      setDepartamentosMostrablesCheckboxFiltradas(departamentosMostrablesCheckBox.slice(indexPrimerDepartamento, indexUltimaDepartamento));
    }
  }

  function filtrarDepartamentos(filtro: string) {
    if (filtro.length > 0) {
      const filtradas = departamentosMostrablesCheckBox.filter(recomendacion =>
        recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())
      );
      setDepartamentosMostrablesCheckboxFiltradas(filtradas.length > 0 ? filtradas : []);
    } else {
      setDepartamentosMostrablesCheckboxFiltradas(departamentosMostrablesCheckBox.slice(indexPrimerDepartamento, indexUltimaDepartamento));
    }
  }

  useEffect(() => {
    setDepartamentosMostrablesCheckboxFiltradas(departamentosMostrablesCheckBox.slice(indexPrimerDepartamento, indexUltimaDepartamento));
  }, [departamentosMostrablesCheckBox, paginaActualDepartamentos, cantidadDepartamentosMostrablesFiltrada]);


  const handleDepartamentosCheckboxChange = async (departamentoId: number) => {
    if (localidadesProvincia.length === 0) {
      buscarLocalidadesProvincia();
    }
    // Obtener una copia del conjunto de departamentos seleccionados
    const updatedSelectedDepartamentos = new Set<number>(idDepartamentosElegidos);

    // Alternar el estado del departamento
    if (updatedSelectedDepartamentos.has(departamentoId)) {
      updatedSelectedDepartamentos.delete(departamentoId);
    } else {
      updatedSelectedDepartamentos.add(departamentoId);
    }

    // Actualizar el conjunto de departamentos seleccionados
    setIdDepartamentosElegidos(updatedSelectedDepartamentos);

    // Inicializa el array nuevasLocalidades
    let nuevasLocalidades = [];

    for (const localidad of localidadesProvincia) {
      // Verifica si el idDepartamento de la localidad está en updatedSelectedDepartamentos
      if (updatedSelectedDepartamentos.has(localidad.departamento.id)) {
        // Añade la localidad a nuevasLocalidades
        nuevasLocalidades.push(localidad);
      }
    }
    // Actualiza el estado con las nuevas localidades
    setLocalidadesMostrables(nuevasLocalidades);
  };

  const handleLocalidadesCheckboxChange = (localidadId: number) => {
    const updatedSelectedLocalidades = new Set(idLocalidadesElegidas);
    if (updatedSelectedLocalidades.has(localidadId)) {
      updatedSelectedLocalidades.delete(localidadId);
    } else {
      updatedSelectedLocalidades.add(localidadId);
    }
    setIdLocalidadesElegidas(updatedSelectedLocalidades);
  };

  const handleCargarNegocio = async () => {
    if (!email) {
      toast.error("Por favor, es necesario el email");
      return;
    } else if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!contraseña) {
      toast.error("Por favor, es necesaria la contraseña");
      return;
    } else if (!telefono) {
      toast.error("Por favor, es necesario el telefono");
      return;
    } else if (!calle) {
      toast.error("Por favor, es necesario la calle para el domicilio");
      return;
    } else if (!numeroCalle) {
      toast.error("Por favor, es necesario el numero del domicilio");
      return;
    } else if (!codigoPostal) {
      toast.error("Por favor, es necesario el código postal del domicilio");
      return;
    } else if (!horarioApertura) {
      toast.error("Por favor, es necesaria la hora de apertura");
      return;
    } else if (!horarioCierre) {
      toast.error("Por favor, es necesaria la hora de cierre");
      return;
    } else if (localidadesMostrablesCheckbox.length === 0) {
      toast.error("Por favor, es necesaria aunque sea una localidad donde alcance el delivery");
      return;
    }

    let sucursal: Sucursal = new Sucursal();

    const domicilio = new Domicilio();
    domicilio.calle = calle;
    domicilio.numero = numeroCalle;
    domicilio.codigoPostal = codigoPostal;
    domicilio.localidad = localidadSucursal;
    domicilio.borrado = 'NO';

    sucursal.domicilios.push(domicilio);

    sucursal.nombre = nombre;

    sucursal.contraseña = contraseña;

    sucursal.telefono = telefono;

    sucursal.email = email;

    sucursal.horarioApertura = horarioApertura;

    sucursal.horarioCierre = horarioCierre;
    let localidadesDelivery: LocalidadDelivery[] = [];

    idLocalidadesElegidas.forEach(id => {
      let localidadBuscada = localidadesMostrablesCheckbox?.find(localidad => localidad.id === id);
      let localidadNueva: LocalidadDelivery = new LocalidadDelivery();

      if (localidadBuscada) {
        localidadNueva.localidad = localidadBuscada;
        localidadesDelivery.push(localidadNueva);
      }
    });

    sucursal.localidadesDisponiblesDelivery = localidadesDelivery;
    sucursal.borrado = 'NO';

    toast.promise(SucursalService.createSucursal(sucursal, imagenes), {
      loading: 'Guardando sucursal...',
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
              <input autoComplete='false' type="text" value={nombre} required={true} onChange={(e) => { setNombre(e.target.value) }} />
              <span>Nombre de la sucursal</span>
            </div>
            <div className="inputBox">
              <input autoComplete='false' type="text" value={email} required={true} onChange={(e) => { setEmail(e.target.value) }} />
              <span>Correo electrónico</span>
            </div>
            <div className="inputBox">
              <input type="password" required={true} value={contraseña} onChange={(e) => { setContraseña(e.target.value) }} />
              <span>Contraseña</span>
            </div>
            <div className="inputBox">
              <input type="phone" required={true} value={telefono} onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
              <span>Telefono</span>
            </div>
            <div className="inputBox">
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Horario de apertura:</label>
              <input type="time" required={true} value={horarioApertura} onChange={(e) => { setHorarioApertura(e.target.value) }} />

            </div>
            <div className="inputBox">
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Horario de cierre:</label>
              <input type="time" required={true} value={horarioCierre} onChange={(e) => { setHorarioCierre(e.target.value) }} />

            </div>
            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Paso 2 - Domicilio</h4>
            <div className="inputBox">
              <input type="text" required={true} value={calle} onChange={(e) => { setCalle(e.target.value) }} />
              <span>Nombre de calle</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={numeroCalle} onChange={(e) => { setNumeroCalle(parseInt(e.target.value)) }} />
              <span>Número de domicilio</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={codigoPostal} onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }} />
              <span>Código Postal</span>
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Pais:</label>
              <InputComponent disabled={false} placeHolder='Seleccionar pais...' onInputClick={() => setModalBusquedaPais(true)} selectedProduct={inputPais ?? ''} />
              {modalBusquedaPais && <ModalFlotanteRecomendacionesPais onCloseModal={handleModalClose} onSelectPais={(pais) => { setInputPais(pais.nombre); handleModalClose(); }} />}
            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Provincia:</label>
              <InputComponent disabled={inputPais.length === 0} placeHolder='Seleccionar provincia...' onInputClick={() => setModalBusquedaProvincia(true)} selectedProduct={inputProvincia ?? ''} />
              {modalBusquedaProvincia && <ModalFlotanteRecomendacionesProvincias onCloseModal={handleModalClose} onSelectProvincia={(provincia) => { setInputProvincia(provincia.nombre); handleModalClose(); }} />}

            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Departamento:</label>
              <InputComponent disabled={inputProvincia.length === 0} placeHolder='Seleccionar departamento...' onInputClick={() => setModalBusquedaDepartamento(true)} selectedProduct={inputDepartamento ?? ''} />
              {modalBusquedaDepartamento && <ModalFlotanteRecomendacionesDepartamentos onCloseModal={handleModalClose} onSelectDepartamento={(departamento) => { setInputDepartamento(departamento.nombre); handleModalClose(); }} inputProvincia={inputProvincia} />}

            </div>
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Localidad:</label>
              <InputComponent disabled={inputDepartamento.length === 0} placeHolder='Seleccionar localidad...' onInputClick={() => setModalBusquedaLocalidad(true)} selectedProduct={localidadSucursal.nombre ?? ''} />
              {modalBusquedaLocalidad && <ModalFlotanteRecomendacionesLocalidades onCloseModal={handleModalClose} onSelectLocalidad={(localidad) => { setLocalidadSucursal(localidad); handleModalClose(); }} inputDepartamento={inputDepartamento} inputProvincia={inputProvincia} />}

            </div>
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>

            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4>Paso 3 - Departamentos para delivery</h4>
            <div className="inputBox">
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Departamentos disponibles para delivery dentro de la provincia de {inputProvincia}:</label>
            </div>
            <div className="filtros">
              <div className="inputBox-filtrado">
                <select id="cantidad" name="cantidadProductos" value={cantidadDepartamentosMostrablesFiltrada} onChange={(e) => cantidadMostradaDepartamentos(parseInt(e.target.value))}>
                  <option value={11} disabled >Selecciona una cantidad a mostrar</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="filtros-datos">
                <div className="inputBox-filtrado" >
                  <input
                    type="text"
                    required
                    onChange={(e) => filtrarDepartamentos(e.target.value)}
                  />
                  <span>Filtrar por nombre</span>
                </div>
              </div>
            </div>
            <table>
              <tbody>
                {departamentosMostrablesCheckboxFiltradas.map((departamento, index) => (
                  <tr key={index}>
                    <td>{departamento.nombre}</td>
                    <td>
                      <input
                        type="checkbox"
                        id={`localidad-${index}`}
                        value={departamento.id}
                        checked={idDepartamentosElegidos.has(departamento.id)}
                        onChange={() => handleDepartamentosCheckboxChange(departamento.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from({ length: paginasTotalesDepartamentos }, (_, index) => (
                <button key={index + 1} onClick={() => paginateDepartamentos(index + 1)} disabled={paginaActualDepartamentos === index + 1}>
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>

            </div>
          </>
        );
      case 4:
        return (
          <>
            <h4>Paso 4 - Localidades para delivery</h4>
            <div className="inputBox">
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Localidades disponibles para delivery:</label>
            </div>
            <div className="filtros">
              <div className="inputBox-filtrado">
                <select id="cantidad" name="cantidadProductos" value={cantidadLocalidadesMostrablesFiltradas} onChange={(e) => cantidadMostradaLocalidades(parseInt(e.target.value))}>
                  <option value={11} disabled >Selecciona una cantidad a mostrar</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="filtros-datos">
                <div className="inputBox-filtrado" >
                  <input
                    type="text"
                    required
                    onChange={(e) => filtrarLocalidades(e.target.value)}
                  />
                  <span>Filtrar por nombre</span>
                </div>
              </div>
            </div>
            {localidadesMostrablesCheckboxFiltradas && (
              <table>
                <tbody>
                  {localidadesMostrablesCheckboxFiltradas.map((localidad, index) => (
                    <tr key={index}>
                      <td>{localidad.nombre}</td>
                      <td>
                        <input
                          type="checkbox"
                          value={localidad.id}
                          checked={idLocalidadesElegidas.has(localidad.id)}
                          onChange={() => handleLocalidadesCheckboxChange(localidad.id)}
                        />
                      </td>
                    </tr>

                  ))}
                </tbody>
              </table>
            )}
            <div className="pagination">
              {Array.from({ length: paginasTotalesLocalidades }, (_, index) => (
                <button key={index + 1} onClick={() => paginateLocalidades(index + 1)} disabled={paginaActualLocalidades === index + 1}>
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>

            </div>
          </>
        );
      case 5:
        return (
          <>
            <h4>Paso final - Imagen</h4>
            <div >
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
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-completar' onClick={handleCargarNegocio}>Agregar sucursal ✓</button>

            </div>
          </>
        );
    }
  }

  return (
    <div className='modal-info'>
      <h2>&mdash; Agregar sucursal &mdash;</h2>
      <Toaster />
      {renderStep()}
      <hr />

    </div>
  )
}

export default AgregarSucursal
