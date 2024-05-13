import { useState } from 'react';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import { EnumTipoArticuloComida } from '../../types/Productos/EnumTipoArticuloComida';
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
  const [imagenes, setImagenes] = useState<ImagenesProducto[]>(articuloOriginal.imagenes);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const [tipo, setTipo] = useState<EnumTipoArticuloComida>(0);
  const [precioVenta, setPrecio] = useState(0);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [medida, setMedidaCantidad] = useState<EnumMedida>(0);
  const [cantidad, setCantidad] = useState(0);

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
    if (!nombre || !cantidad || !medida || !precioVenta || !descripcion) {
      toast.info("Por favor, complete todos los campos requeridos.");
      return;
    }

    const articuloActualizado: ArticuloVenta = {
      ...articuloOriginal,
      nombre,
      precioVenta,
      tipo,
      cantidad,
      medida
    };

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
      toast.info('No se añadieron imagenes al menú');
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
        <input type="text" placeholder="Nombre del articulo" value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
        <br />
        <input type="text" placeholder="Descripción del articulo" value={descripcion} onChange={(e) => { setDescripcion(e.target.value) }} />
        <br />
        <label>
          <select name="tipoArticulo" onChange={(e) => { setTipo(parseInt(e.target.value)) }}>
            <option>Seleccionar tipo de articulo</option>
            <option value={EnumTipoArticuloVenta.BEBIDA_CON_ALCOHOL}>Bebida sin alcohol</option>
            <option value={EnumTipoArticuloVenta.BEBIDA_SIN_ALCOHOL}>Bebida con alcohol</option>
          </select>
        </label>
        <br />
        <input type="number" placeholder="Precio" value={precioVenta} onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />
        <br />
        <input type="number" placeholder="Cantidad" onChange={(e) => { setCantidad(parseFloat(e.target.value)) }} />
        <br />
        <select
          onChange={(e) => setMedidaCantidad(parseInt(e.target.value))}
        >
          <option value="">Seleccionar medida ingrediente</option>
          <option value={EnumMedida.KILOGRAMOS}>Kilogramos</option>
          <option value={EnumMedida.GRAMOS}>Gramos</option>
          <option value={EnumMedida.LITROS}>Litros</option>
          <option value={EnumMedida.CENTIMETROS_CUBICOS}>Centimetros cúbicos</option>
          <option value={EnumMedida.UNIDADES}>Unidades</option>
        </select>
        <br />
        <button className='button-form' type='button' onClick={editarArticuloVenta}>Editar articulo</button>
      </div>


    </div >
  )
}


export default EditarArticuloVenta
