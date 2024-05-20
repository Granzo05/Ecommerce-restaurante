import { useEffect, useState } from 'react';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import { ImagenesProductoDTO } from '../../types/Productos/ImagenesProductoDTO';
import { ImagenesProducto } from '../../types/Productos/ImagenesProducto';
import { Toaster, toast } from 'sonner'
import './editarArticuloVenta.css'
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { EnumTipoArticuloVenta } from '../../types/Productos/EnumTipoArticuloVenta';

interface EditarArticuloVentaProps {
  articuloOriginal: ArticuloVenta;
}

const EditarArticuloVenta: React.FC<EditarArticuloVentaProps> = ({ articuloOriginal }) => {
  const [imagenesMuestra, setImagenesMuestra] = useState<ImagenesProductoDTO[]>(articuloOriginal.imagenesDTO);
  const [imagenesEliminadas, setImagenesEliminadas] = useState<ImagenesProductoDTO[]>([]);
  const [imagenes, setImagenes] = useState<ImagenesProducto[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const [tipo, setTipo] = useState<EnumTipoArticuloVenta | string>(articuloOriginal.tipo.toString());
  const [precioVenta, setPrecio] = useState(articuloOriginal.precioVenta);
  const [nombre, setNombre] = useState(articuloOriginal.nombre);
  const [medida, setMedida] = useState<EnumMedida | string>(articuloOriginal.medida?.toString());
  const [cantidad, setCantidad] = useState(articuloOriginal.cantidadMedida);


  useEffect(() => {
    console.log(articuloOriginal)
  }, []);

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

  function editarArticuloVenta() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!cantidad) {
      toast.error("Por favor, es necesaria la cantidad");
      return;
    } else if (!medida) {
      toast.error("Por favor, es necesaria la medida");
      return;
    } else if (!precioVenta) {
      toast.error("Por favor, es necesario el precio");
      return;
    } else if (!tipo) {
      toast.error("Por favor, es necesario el tipo");
      return;
    } else if (imagenes.length === 0) {
      toast.info("No se asignó ninguna imagen");
      return;
    }

    const articuloActualizado: ArticuloVenta = {
      ...articuloOriginal,
      nombre,
      precioVenta,
      tipo,
      cantidadMedida: cantidad,
      medida
    };

    console.log(articuloActualizado)

    toast.promise(ArticuloVentaService.updateArticulo(articuloActualizado, imagenes, imagenesEliminadas), {
      loading: 'Editando articulo...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });

    if (imagenes.length === 0) {
      toast.info('No se añadieron imagenes al articulo');
    }
  }

  return (
    <div className="modal-info">
      <Toaster />
      <div id="inputs-imagenes">
        {imagenesMuestra.map((imagen, index) => (
          <div key={index}>
            {imagen && (
              <img
                className='imagen-muestra-articulo'
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

      <div>
        <div className="inputBox">
          <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
          <span>Nombre del articulo</span>
        </div>
        <br />

        <div className="inputBox">
          <input type="text" required={true} value={precioVenta} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
          <span>Precio del articulo</span>
        </div>
        <br />
        <div className="inputBox">
          <input type="text" required={true} value={cantidad} onChange={(e) => { setCantidad(parseFloat(e.target.value)) }} />
          <span>Cantidad</span>
        </div>
        <br />
        <label>
          <select value={tipo} name="tipoArticulo" onChange={(e) => { setTipo(e.target.value) }}>
            <option value="">Seleccionar tipo de articulo</option>
            <option value={EnumTipoArticuloVenta.BEBIDA_SIN_ALCOHOL.toString()}>Bebida sin alcohol</option>
            <option value={EnumTipoArticuloVenta.BEBIDA_CON_ALCOHOL.toString()}>Bebida con alcohol</option>
          </select>
        </label>
        <br />
        <select
          value={medida}
          onChange={(e) => setMedida(e.target.value)}
        >
          <option value="">Seleccionar medida ingrediente</option>
          <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
          <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
          <option value={EnumMedida.LITROS.toString()}>Litros</option>
          <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
          <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
        </select>
        <br />
        <button className='button-form' type='button' onClick={editarArticuloVenta}>Editar articulo</button>
      </div>


    </div >
  )
}


export default EditarArticuloVenta
