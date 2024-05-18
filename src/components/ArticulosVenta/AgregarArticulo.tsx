import { useState } from 'react';
import { ImagenesProducto } from '../../types/Productos/ImagenesProducto';
import { Toaster, toast } from 'sonner'
import { ArticuloVentaService } from '../../services/ArticuloVentaService';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { EnumMedida } from '../../types/Ingredientes/EnumMedida';
import { EnumTipoArticuloVenta } from '../../types/Productos/EnumTipoArticuloVenta';
import { clearInputs } from '../../utils/global_variables/functions';
import '../../styles/inputLabel.css'

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

  const [tipo, setTipo] = useState<EnumTipoArticuloVenta | string>('');
  const [precio, setPrecio] = useState(0);
  const [nombre, setNombre] = useState('');
  const [medida, setMedida] = useState<EnumMedida | string>('');
  const [cantidad, setCantidad] = useState(0);

  async function agregarArticulo() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!cantidad) {
      toast.error("Por favor, es necesaria la cantidad");
      return;
    } else if (!medida) {
      toast.error("Por favor, es necesaria la medida");
      return;
    } else if (!precio) {
      toast.error("Por favor, es necesario el precio");
      return;
    } else if (!tipo) {
      toast.error("Por favor, es necesario el tipo");
      return;
    } else if (imagenes.length === 0) {
      toast.info("No se asignó ninguna imagen");
      return;
    }

    const articulo: ArticuloVenta = new ArticuloVenta();

    articulo.nombre = nombre;
    articulo.tipo = tipo;
    articulo.precioVenta = precio;
    articulo.medida = medida;
    articulo.cantidadMedida = cantidad;

    toast.promise(ArticuloVentaService.createArticulo(articulo, imagenes), {
      loading: 'Creando articulo...',
      success: (message) => {
        clearInputs();
        return message;
      },
      error: (message) => {
        return message;
      },
    });

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
      <div className="inputBox">
        <input type="text" required={true} onChange={(e) => { setNombre(e.target.value) }} />
        <span>Nombre del articulo</span>
      </div>
      <div className="inputBox">
        <input type="number" required={true} onChange={(e) => setPrecio(parseFloat(e.target.value))} />
        <span>Precio</span>
      </div>
      <br />
      <div className="inputBox">
        <input type="number" required={true} onChange={(e) => setCantidad(parseFloat(e.target.value))} />
        <span>Cantidad</span>
      </div>
      <label>
        <select name="tipoArticulo" required={true} onChange={(e) => { setTipo(e.target.value) }}>
          <option>Seleccionar tipo de articulo</option>
          <option value={EnumTipoArticuloVenta.BEBIDA_CON_ALCOHOL.toString()}>Bebida sin alcohol</option>
          <option value={EnumTipoArticuloVenta.BEBIDA_SIN_ALCOHOL.toString()}>Bebida con alcohol</option>
        </select>
      </label>
      <br />

      <select
        onChange={(e) => setMedida(e.target.value)}
      >
        <option>Seleccionar medida</option>
        <option value={EnumMedida.KILOGRAMOS.toString()}>Kilogramos</option>
        <option value={EnumMedida.GRAMOS.toString()}>Gramos</option>
        <option value={EnumMedida.LITROS.toString()}>Litros</option>
        <option value={EnumMedida.CENTIMETROS_CUBICOS.toString()}>Centimetros cúbicos</option>
        <option value={EnumMedida.UNIDADES.toString()}>Unidades</option>
      </select>
      <br />
      <button type="button" onClick={agregarArticulo}>Agregar articulo</button>
    </div >
  )
}

export default AgregarArticuloVenta
