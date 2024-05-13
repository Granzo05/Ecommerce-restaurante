import { useState } from 'react';
import { ImagenesProducto } from '../../types/Productos/ImagenesProducto';
import { Toaster, toast } from 'sonner'
import { EnumTipoArticuloComida } from '../../types/Productos/EnumTipoArticuloComida';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import { EnumTipoArticuloVenta } from '../../types/Productos/EnumTipoArticuloVenta';

function AgregarArticuloVenta() {
  const [imagenes, setImagenes] = useState<ImagenesProducto[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const handleImagen = (index: number, file: File | null) => {
    if (file) {
      const newImagenes = [...imagenes];
      newImagenes[index] = { ...newImagenes[index], file };
      setImagenes(newImagenes);
    }
  };

  const añadirCampoImagen = () => {
    setImagenes([...imagenes, { index: imagenes.length, file: null } as ImagenesProducto]);
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

  const [tipo, setTipo] = useState<EnumTipoArticuloComida>(0);
  const [precio, setPrecio] = useState(0);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [medidaCantidad, setMedidaCantidad] = useState<EnumMedida>(0);
  const [cantidad, setCantidad] = useState(0);

  async function agregarArticulo() {
    if (!nombre || !cantidad || !medidaCantidad || !precio || !descripcion) {
      toast.info("Por favor, complete todos los campos requeridos.");
      return;
    }

    const articulo: ArticuloVenta = new ArticuloVenta();

    articulo.nombre = nombre;
    articulo.tipo = tipo;
    articulo.precioVenta = precio;
    articulo.medida = medidaCantidad;
    articulo.cantidadMedida = cantidad;

    toast.promise(ArticuloVentaService.createArticulo(articulo, imagenes), {
      loading: 'Creando articulo...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
    //clearInputs();

  }

  return (
    <div className="modal-info">
      <Toaster />
      <div id="inputs-imagenes">
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
      <input type="text" placeholder="Nombre del articulo" id="nombreArticulo" onChange={(e) => { setNombre(e.target.value) }} />

      <br />
      <input type="text" placeholder="Descripción del articulo" id="descripcion" onChange={(e) => { setDescripcion(e.target.value) }} />

      <br />
      <label>
        <select name="tipoArticulo" onChange={(e) => { setTipo(parseInt(e.target.value)) }}>
          <option>Seleccionar tipo de articulo</option>
          <option value={EnumTipoArticuloVenta.BEBIDA_CON_ALCOHOL}>Bebida sin alcohol</option>
          <option value={EnumTipoArticuloVenta.BEBIDA_SIN_ALCOHOL}>Bebida con alcohol</option>
        </select>
      </label>
      <br />
      <br />
      <input type="number" placeholder="Precio" id="precioArticulo" onChange={(e) => { setPrecio(parseFloat(e.target.value)) }} />

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
      <button type="button" onClick={agregarArticulo}>Agregar articulo</button>
    </div >
  )
}

export default AgregarArticuloVenta
