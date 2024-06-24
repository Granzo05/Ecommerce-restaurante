import { useEffect, useState } from 'react';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Localidad } from '../../types/Domicilio/Localidad';
import { SucursalService } from '../../services/SucursalService';
import { Toaster, toast } from 'sonner'
import { LocalidadDelivery } from '../../types/Restaurante/LocalidadDelivery';
import InputComponent from '../InputFiltroComponent';
import { DepartamentoService } from '../../services/DepartamentoService';
import { LocalidadService } from '../../services/LocalidadService';
import { Departamento } from '../../types/Domicilio/Departamento';
import ModalFlotanteRecomendacionesLocalidades from '../../hooks/ModalFlotanteFiltroLocalidades';
import ModalFlotanteRecomendacionesDepartamentos from '../../hooks/ModalFlotanteFiltroDepartamentos';
import ModalFlotanteRecomendacionesProvincias from '../../hooks/ModalFlotanteFiltroProvincia';
import { Imagenes } from '../../types/Productos/Imagenes';
import ModalFlotanteRecomendacionesPais from '../../hooks/ModalFlotanteFiltroPais';
import { Pais } from '../../types/Domicilio/Pais';
import { Provincia } from '../../types/Domicilio/Provincia';

interface EditarSucursalProps {
  sucursalOriginal: Sucursal;
  onCloseModal: () => void;
}

const EditarSucursal: React.FC<EditarSucursalProps> = ({ sucursalOriginal, onCloseModal }) => {
  // Atributos necesarios para Sucursal
  const [email, setEmail] = useState(sucursalOriginal.email);
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState(sucursalOriginal.telefono);
  const [horarioApertura, setHorarioApertura] = useState(sucursalOriginal.horarioApertura);
  const [horarioCierre, setHorarioCierre] = useState(sucursalOriginal.horarioCierre);

  //Select que nos permite filtrar para las localidades de la sucursal asi no cargamos de más innecesariamente
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [localidadesProvincia, setLocalidadesProvincia] = useState<Localidad[]>([]);

  const [localidadesMostrablesCheckbox, setLocalidadesMostrables] = useState<Localidad[]>([]);

  const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);
  const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
  const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
  const [modalBusquedaPais, setModalBusquedaPais] = useState<boolean>(false);
  const [inputProvincia, setInputProvincia] = useState<string>('');
  const [indexDomicilio, setIndexDomicilio] = useState<number>(0);
  const [indexDomicilioModificable, setIndexDomicilioModificable] = useState<number>(0);
  const [domiciliosModificable, setDomiciliosModificable] = useState<Domicilio[]>(sucursalOriginal.domicilios);
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);

  const [idDepartamentosElegidos, setIdDepartamentosElegidos] = useState<Set<number>>(new Set<number>());

  const [idLocalidadesElegidas, setIdLocalidadesElegidas] = useState<Set<number>>(new Set<number>());

  const [imagenesMuestra, setImagenesMuestra] = useState<Imagenes[]>(sucursalOriginal.imagenes);
  const [imagenesEliminadas, setImagenesEliminadas] = useState<Imagenes[]>([]);
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagenesMuestra.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagenesMuestra.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    buscarDepartamentos();
    buscarLocalidadesProvincia();
  }, []);

  const [localidadesCargadas, setLocalidadesCargadas] = useState(false);

  useEffect(() => {
    if (!localidadesCargadas && sucursalOriginal.localidadesDisponiblesDelivery.length > 0) {
      const uniqueDepartamentos = new Set<number>();
      const uniqueLocalidades = new Set<number>();
      const nuevasLocalidades: Localidad[] = [];

      sucursalOriginal.localidadesDisponiblesDelivery.forEach(localidadDelivery => {
        const localidadId = localidadDelivery.localidad?.id;
        const departamentoId = localidadDelivery.localidad?.departamento?.id;

        if (localidadId && departamentoId) {
          uniqueDepartamentos.add(departamentoId);
          uniqueLocalidades.add(localidadId);

          const localidad: Localidad = {
            nombre: localidadDelivery.localidad?.nombre,
            departamento: localidadDelivery.localidad?.departamento,
            id: localidadId
          };

          nuevasLocalidades.push(localidad);
        }
      });

      setIdDepartamentosElegidos(uniqueDepartamentos);
      setIdLocalidadesElegidas(uniqueLocalidades);
      setLocalidadesMostrables(nuevasLocalidades);
      setLocalidadesCargadas(true);
    }
  }, [localidadesCargadas, sucursalOriginal.localidadesDisponiblesDelivery]);


  function buscarDepartamentos() {
    DepartamentoService.getDepartamentosByNombreProvincia(inputProvincia)
      .then(async departamentos => {
        setDepartamentos(departamentos);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  function buscarLocalidadesProvincia() {
    LocalidadService.getLocalidadesByNombreProvincia(inputProvincia)
      .then(async localidades => {
        setLocalidadesProvincia(localidades);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  const handleChangeCalle = (index: number, calle: string) => {
    const nuevosDomicilios = [...domicilios];
    nuevosDomicilios[index].calle = calle;
    setDomicilios(nuevosDomicilios);
  };

  const handleChangeNumeroCasa = (index: number, numero: number) => {
    const nuevosDomicilios = [...domicilios];
    nuevosDomicilios[index].numero = numero;
    setDomicilios(nuevosDomicilios);
  };

  const handleChangeCodigoPostal = (index: number, codigoPostal: number) => {
    const nuevosDomicilios = [...domicilios];
    nuevosDomicilios[index].codigoPostal = codigoPostal;
    setDomicilios(nuevosDomicilios);
  };

  const handleChangePais = (index: number, pais: Pais) => {
    const nuevosDomicilios = [...domicilios];
    if (pais) {
      nuevosDomicilios[index].localidad.departamento.provincia.pais = pais;
      setDomicilios(nuevosDomicilios);
    }
  };

  const handleChangeProvincia = (index: number, provincia: Provincia) => {
    const nuevosDomicilios = [...domicilios];
    if (provincia) {
      setInputProvincia(provincia.nombre)
      nuevosDomicilios[index].localidad.departamento.provincia = provincia;
      setDomicilios(nuevosDomicilios);
    }
  };

  const handleChangeDepartamento = (index: number, departamento: Departamento) => {
    const nuevosDomicilios = [...domicilios];
    if (departamento) {
      nuevosDomicilios[index].localidad.departamento = departamento;
      setDomicilios(nuevosDomicilios);
    }
  };


  const handleChangeLocalidad = (index: number, localidad: Localidad) => {
    const nuevosDomicilios = [...domicilios];
    if (localidad) {
      nuevosDomicilios[index].localidad = localidad;
      setDomicilios(nuevosDomicilios);
    }
  };

  const añadirCampoDomicilio = () => {
    // SI no hay ingredientes que genere en valor 0 de index
    if (domicilios.length === 0) {
      setDomicilios([...domicilios, { id: 0, calle: '', numero: 0, codigoPostal: 0, localidad: new Localidad(), borrado: 'NO' }]);
    } else {
      setDomicilios([...domicilios, { id: 0, calle: '', numero: 0, codigoPostal: 0, localidad: new Localidad(), borrado: 'NO' }]);
      setIndexDomicilio(prevIndex => prevIndex + 1);
    }
  };

  const quitarCampoDomicilio = (index: number) => {
    if (domicilios.length > 0) {
      const nuevosDomicilios = [...domicilios];
      nuevosDomicilios.splice(index, 1);
      setDomicilios(nuevosDomicilios);

      if (indexDomicilio > 0) {
        setIndexDomicilio(indexDomicilio - 1);
      }
    } else {
      setDomicilios([]);
      setIndexDomicilio(0);
    }
  };


  const quitarCampoDomicilioModificable = (index: number) => {
    if (domiciliosModificable.length > 0) {
      const nuevosDomicilios = [...domiciliosModificable];
      nuevosDomicilios.splice(index, 1);
      setDomiciliosModificable(nuevosDomicilios);

      if (indexDomicilioModificable > 0) {
        setIndexDomicilioModificable(indexDomicilioModificable - 1);
      }
    } else {
      setDomiciliosModificable([]);
      setIndexDomicilioModificable(0);
    }
  };

  const handleModalClose = () => {
    setModalBusquedaLocalidad(false)
    setModalBusquedaDepartamento(false)
    setModalBusquedaProvincia(false)
    setModalBusquedaPais(false)
  };

  const handleDepartamentosCheckboxChange = async (departamentoId: number) => {
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
    // Inicializar el array nuevasLocalidades

    const nuevasLocalidades: Localidad[] = [];

    localidadesProvincia.forEach(localidad => {
      updatedSelectedDepartamentos.forEach(idDepartamento => {
        if (localidad.departamento.id === idDepartamento) nuevasLocalidades.push(localidad);

      });
    });

    // Actualizar el estado con las nuevas localidades
    if (nuevasLocalidades.length > 0) setLocalidadesMostrables(nuevasLocalidades);
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
  const [isLoading, setIsLoading] = useState(false);

  const handleCargarNegocio = async () => {
    if (!email) {
      toast.error("Por favor, es necesario el email");
      return;
    } else if (!telefono) {
      toast.error("Por favor, es necesario el telefono");
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
    setIsLoading(true);

    let sucursal: Sucursal = new Sucursal();

    sucursal.id = sucursalOriginal.id;

    domiciliosModificable.forEach((nuevoDomicilio) => {
      const existe = domicilios.some((domicilio) =>
        domicilio.numero === nuevoDomicilio.numero &&
        domicilio.calle === nuevoDomicilio.calle &&
        domicilio.codigoPostal === nuevoDomicilio.codigoPostal
      );

      if (!existe) {
        domicilios.push(nuevoDomicilio);
      }
    });

    sucursal.domicilios = domicilios;

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

    // Usar un bucle inverso para evitar problemas al modificar el array durante la iteración
    for (let i = localidadesDelivery.length - 1; i >= 0; i--) {
      const localidad = localidadesDelivery[i];
      // Verificar si la localidad pertenece a algún departamento elegido
      const guardarLocalidad = idDepartamentosElegidos.has(localidad.localidad.departamento.id);

      // Si no pertenece a ningún departamento elegido, eliminar la localidad del array
      if (!guardarLocalidad) {
        localidadesDelivery.splice(i, 1);
      }
    }

    sucursal.borrado = sucursalOriginal.borrado;
    sucursal.localidadesDisponiblesDelivery = localidadesDelivery;

    toast.promise(SucursalService.updateSucursal(sucursal, imagenes, imagenesEliminadas), {
      loading: 'Actualizando la sucursal...',
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

  return (
    <div className='modal-info'>
      <h2>Editar sucursal</h2>
      <Toaster />
      <form>
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
        <div className="inputBox">
          <input autoComplete='false' type="email" value={email} required={true} onChange={(e) => { setEmail(e.target.value) }} />
          <span>Correo electrónico</span>
        </div>
        <div className="inputBox">
          <input type="password" required={true} onChange={(e) => { setContraseña(e.target.value) }} />
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
        <>
          {domiciliosModificable && domiciliosModificable.map((domicilio, index) => (
            <div key={'domicilioMod' + index}>
              <hr />
              <p className='cierre-ingrediente' onClick={() => quitarCampoDomicilioModificable(index)}>X</p>

              <h2>Domicilio {index + 1}</h2>

              <div className="inputBox">
                <input type="text" required={true} value={domicilio.calle} onChange={(e) => { handleChangeCalle(index, e.target.value) }} />
                <span>Nombre de calle</span>
              </div>
              <div className="inputBox">
                <input type="number" required={true} value={domicilio.numero} onChange={(e) => { handleChangeNumeroCasa(index, parseInt(e.target.value)) }} />
                <span>Número de domicilio</span>
              </div>
              <div className="inputBox">
                <input type="number" required={true} value={domicilio.codigoPostal} onChange={(e) => { handleChangeCodigoPostal(index, parseInt(e.target.value)) }} />
                <span>Código Postal</span>
              </div>
              <div className="inputBox">
                <input type="text" disabled required={true} value={domicilio.localidad?.nombre} />
              </div>
            </div>
          ))}
        </>

        <>
          {domicilios && indexDomicilio > 0 && domicilios.map((domicilio, index) => (
            <div key={'domicilio' + index}>
              <div className="inputBox">
                <input type="text" required={true} onChange={(e) => { handleChangeCalle(index, e.target.value) }} />
                <span>Nombre de calle</span>
              </div>
              <div className="inputBox">
                <input type="number" required={true} onChange={(e) => { handleChangeNumeroCasa(index, parseInt(e.target.value)) }} />
                <span>Número de domicilio</span>
              </div>
              <div className="inputBox">
                <input type="number" required={true} onChange={(e) => { handleChangeCodigoPostal(index, parseInt(e.target.value)) }} />
                <span>Código Postal</span>
              </div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Pais:</label>
              <InputComponent disabled={false} placeHolder='Seleccionar pais...' onInputClick={() => setModalBusquedaPais(true)} selectedProduct={domicilio.localidad?.departamento?.provincia?.pais?.nombre ?? ''} />
              {modalBusquedaPais && <ModalFlotanteRecomendacionesPais onCloseModal={handleModalClose} onSelectPais={(pais) => { handleChangePais(index, pais); handleModalClose(); }} />}
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Provincia:</label>
              <InputComponent disabled={domicilio.localidad?.departamento?.provincia?.pais.nombre.length === 0} placeHolder='Seleccionar provincia...' onInputClick={() => setModalBusquedaProvincia(true)} selectedProduct={domicilio.localidad?.departamento?.provincia?.nombre ?? ''} />
              {modalBusquedaProvincia && <ModalFlotanteRecomendacionesProvincias onCloseModal={handleModalClose} onSelectProvincia={(provincia) => { handleChangeProvincia(index, provincia); handleModalClose(); }} />}
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Departamento:</label>
              <InputComponent disabled={domicilio.localidad?.departamento?.provincia?.nombre.length === 0} placeHolder='Seleccionar departamento...' onInputClick={() => setModalBusquedaDepartamento(true)} selectedProduct={domicilio.localidad?.departamento?.nombre ?? ''} />
              {modalBusquedaDepartamento && <ModalFlotanteRecomendacionesDepartamentos onCloseModal={handleModalClose} onSelectDepartamento={(departamento) => { handleChangeDepartamento(index, departamento); handleModalClose(); }} inputProvincia={domicilio.localidad?.departamento?.provincia?.nombre} />}
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Localidad:</label>
              <InputComponent disabled={domicilio.localidad?.departamento?.nombre.length === 0} placeHolder='Seleccionar localidad...' onInputClick={() => setModalBusquedaLocalidad(true)} selectedProduct={domicilio.localidad.nombre ?? ''} />
              {modalBusquedaLocalidad && <ModalFlotanteRecomendacionesLocalidades onCloseModal={handleModalClose} onSelectLocalidad={(localidad) => { handleChangeLocalidad(index, localidad); handleModalClose(); }} inputDepartamento={domicilio.localidad?.departamento?.nombre} inputProvincia={domicilio.localidad?.departamento?.provincia?.nombre} />}
              <hr />
              <hr /><p onClick={() => quitarCampoDomicilio(index)}>X</p>
            </div>
          ))}
          <button onClick={añadirCampoDomicilio}>Añadir domicilio</button>
        </>


        <div className="inputBox">
          <label style={{ display: 'flex', fontWeight: 'bold', marginBottom: '-20px' }}>Departamentos disponibles para delivery:</label>

        </div>
        {departamentos && (
          <table>
            <tbody>

              {departamentos.map((departamento, index) => (
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
        )}

        <div className="inputBox">

          <label style={{ display: 'flex', fontWeight: 'bold', marginBottom: '-20px' }}>Localidades disponibles para delivery:</label>
        </div>
        {localidadesMostrablesCheckbox && (
          <table>
            <tbody>
              {localidadesMostrablesCheckbox.map((localidad, index) => (
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

      </form>
      <hr />
      <button className='btn-accion-completar' onClick={handleCargarNegocio} disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Editar sucursal ✓'}
      </button>
    </div >
  )
}

export default EditarSucursal
