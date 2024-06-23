import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner'
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import ModalFlotanteRecomendacionesCategoria from '../../hooks/ModalFlotanteFiltroCategorias';
import InputComponent from '../InputFiltroComponent';
import { Categoria } from '../../types/Ingredientes/Categoria';
import { CategoriaService } from '../../services/CategoriaService';
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Empresa } from '../../types/Restaurante/Empresa';

interface AgregarSubcategoriaProps {
  onCloseModal: () => void;
}


const AgregarSubcategoria: React.FC<AgregarSubcategoriaProps> = ({ onCloseModal }) => {

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

  const [categoria, setCategoria] = useState<Categoria>();
  const [nombreSubcategoria, setNombreSubcategoria] = useState<string>('');

  const [modalBusquedaCategoria, setModalBusquedaCategoria] = useState<boolean>(false);

  const handleModalClose = () => {
    setModalBusquedaCategoria(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  async function agregarCategoria() {
    const subcategoria: Subcategoria = new Subcategoria();
    setIsLoading(true);

    if (!categoria) {
      toast.info("Por favor, es necesaria la categoria");
      return;
    } else if (!nombreSubcategoria || !nombreSubcategoria.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)) {
      toast.info("Por favor, asigne un nombre válido");
      return;
    }

    subcategoria.nombre = nombreSubcategoria;
    subcategoria.borrado = 'NO';

    let subcategoriaExistente = categoria.subcategorias.find(subcategoria => subcategoria.nombre === nombreSubcategoria);

    // Si no existe, crear una nueva subcategoría y agregarla
    if (!subcategoriaExistente) {
      categoria.subcategorias.push(subcategoria);
    }

    console.log(categoria)

    toast.promise(CategoriaService.updateCategoriaBorrado(categoria), {
      loading: 'Creando subcategoria...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return "Subcategoría creada correctamente";
      },
      error: (message) => {
        return "No se pudo crear la subcategoría";
      },
      finally: () => {
        setIsLoading(false);
      }
    });
  }

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
            <Toaster />
            <div>
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Categoría:</label>
              <InputComponent disabled={false} placeHolder={'Filtrar categorias...'} onInputClick={() => setModalBusquedaCategoria(true)} selectedProduct={categoria?.nombre ?? ''} />
              {modalBusquedaCategoria && <ModalFlotanteRecomendacionesCategoria datosOmitidos={categoria?.nombre ?? ''} onCloseModal={handleModalClose} onSelectCategoria={(categoria) => { setCategoria(categoria); handleModalClose(); }} />}
            </div>
            <div className="inputBox">
              <input type="text" required={true} value={nombreSubcategoria} onChange={(e) => { setNombreSubcategoria(e.target.value) }} pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+" />
              <span>Nombre de la subcategoria</span>

              <div className="error-message">El nombre debe contener letras y espacios.</div>
            </div>
            <div className="btns-pasos">{empresa && empresa?.id > 0 ? (
              <button className='btn-accion-adelante' onClick={nextStep}>Seleccionar sucursales ⭢</button>
            ) : (
              <button className='btn-accion-completar' onClick={agregarCategoria} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Cargar ✓'}
              </button>
            )}</div>

          </>
        );
      case 2:
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
              <button className='btn-accion-completar' onClick={agregarCategoria} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Cargar ✓'}
              </button>
            </div>
          </>
        );
    }
  }

  return (
    <div className="modal-info">
      <h2>&mdash; Agregar subcategoría &mdash;</h2>
      <Toaster />
      {renderStep()}

    </div >
  );
}


export default AgregarSubcategoria
