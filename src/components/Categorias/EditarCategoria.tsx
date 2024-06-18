import { useEffect, useState } from 'react';
import { Categoria } from '../../types/Ingredientes/Categoria';
import { Toaster, toast } from 'sonner'
import { CategoriaService } from '../../services/CategoriaService';
import { Imagenes } from '../../types/Productos/Imagenes';
import { Empresa } from '../../types/Restaurante/Empresa';
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';

interface EditarCategoriaProps {
  categoriaOriginal: Categoria;
  onCloseModal: () => void;
}

const EditarCategoria: React.FC<EditarCategoriaProps> = ({ categoriaOriginal, onCloseModal }) => {

  const [imagenesMuestra, setImagenesMuestra] = useState<Imagenes[]>(categoriaOriginal.imagenes);
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

  const [nombre, setNombre] = useState(categoriaOriginal.nombre);

  function editarCategoria() {
    const categoria: Categoria = categoriaOriginal;
    categoria.borrado = 'NO';

    if (!nombre) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    categoria.nombre = nombre;

    let sucursalesElegidas: Sucursal[] = [];

    idsSucursalesElegidas.forEach(idSucursal => {
      let sucursal: Sucursal = new Sucursal();
      sucursal.id = idSucursal;
      sucursalesElegidas.push(sucursal);
    });

    categoria.sucursales = sucursalesElegidas;

    toast.promise(CategoriaService.updateCategoria(categoria, imagenes, imagenesEliminadas), {
      loading: 'Editando Categoria...',
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
            <h2>Editar categoria</h2>
            <Toaster />
            <div className="slider-container">
              <button onClick={prevImage} className="slider-button prev">◀</button>
              <div className='imagenes-wrapper'>
                {imagenesMuestra?.map((imagen, index) => (
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
              <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
              <span>Nombre del categoria</span>
            </div>
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              {empresa && empresa?.id > 0 ? (
                <button className='btn-accion-adelante' onClick={nextStep}>Seleccionar sucursales ⭢</button>
              ) : (
                <button onClick={editarCategoria}>Editar categoria</button>
              )}
            </div>
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
              <button onClick={editarCategoria}>Editar categoria</button>
            </div>
          </>
        );
    }
  }

  return (
    <div className="modal-info">
      <h2>&mdash; Agregar artículo para venta &mdash;</h2>
      <Toaster />
      {renderStep()}

    </div >
  );
}


export default EditarCategoria
