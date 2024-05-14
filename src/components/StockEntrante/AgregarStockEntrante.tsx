import { useEffect, useState } from 'react';
import { StockEntrante } from '../../types/Stock/StockEntrante';
import { StockEntranteService } from '../../services/StockEntranteService';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { DetalleStock } from '../../types/Stock/DetalleStock';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import { IngredienteService } from '../../services/IngredienteService';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';
import { toast, Toaster } from 'sonner';

function AgregarStockEntrante() {

  const [fecha, setFecha] = useState(new Date());

  // Con estos inputs voy rellenando en caso de ser necesario agregar más campos
  const [articulosVentaInputs, setArticulosVentaInputs] = useState<ArticuloVenta[]>([]);
  const [articulosVentaRecomendados, setArticulosVentaRecomendados] = useState<ArticuloVenta[]>([]);
  const [ingredientesInputs, setIngredientesInputs] = useState<Ingrediente[]>([]);
  const [ingredientesRecomendados, setIngredientesRecomendados] = useState<Ingrediente[]>([]);

  // Estos index sirven para colocar el nombre del articulo al index correcto en caso de hacer clic en la recomendacion de ingrediente o articulo
  // Ya que puedo acceder al index actual de detalles
  let [lastIndexDetalle] = useState<number>(0);
  // Estos datos traigo de la db para mostrar los posibles resultados
  const [articulosVenta, setArticulosVenta] = useState<ArticuloVenta[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

  // Aca almaceno los detalles para el stock
  const [detallesStock] = useState<DetalleStock[]>([])

  useEffect(() => {
    // Con estos cargos los resultados mostrados en los inputs como recomendación
    cargarResultadosIngredientes();
    cargarResultadosArticulos();
  }, []);

  function cargarResultadosIngredientes() {
    IngredienteService.getIngredientes()
      .then(data => {
        setIngredientes(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function cargarResultadosArticulos() {
    ArticuloVentaService.getArticulos()
      .then(data => {
        setArticulosVenta(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Almacenaje de cada detalle por ingrediente
  const almacenarIngrediente = (index: number, nombre: string) => {
    // Busco todos los articulos que de nombre se parezcan
    const ingredientesRecomendados = ingredientes?.filter(ingrediente =>
      ingrediente.nombre.toLowerCase().includes(nombre.toLowerCase())
    );

    setIngredientesRecomendados(ingredientesRecomendados);

    let ingrediente = ingredientes.find(ingrediente => ingrediente.nombre === nombre);

    if (ingrediente) {
      detallesStock[index].ingrediente = ingrediente;
    }
  };

  const almacenarCantidad = (index: number, cantidad: number) => {
    if (cantidad) {
      detallesStock[index].cantidad = cantidad;
    }
  };

  const almacenarSubTotal = (index: number, costo: number) => {
    if (costo) {
      detallesStock[index].costoUnitario = costo;
      detallesStock[index].subTotal = costo * detallesStock[index].cantidad;
    }
  };

  const añadirCampoIngrediente = () => {
    setIngredientesInputs([...ingredientesInputs, { id: 0, nombre: '', stock: null, medida: '' }]);

    if (lastIndexDetalle !== 0) lastIndexDetalle++;
  };

  const quitarCampoIngrediente = () => {
    if (ingredientesInputs.length > 0) {
      const nuevosIngredientes = [...ingredientesInputs];
      nuevosIngredientes.pop();
      setIngredientesInputs(nuevosIngredientes);
    }
  };

  // Almacenaje de cada detalle por articulo
  const almacenarArticulo = (index: number, nombre: string) => {
    // Busco todos los articulos que de nombre se parezcan
    const articulosRecomendados = articulosVenta?.filter(articulo =>
      articulo.nombre.toLowerCase().includes(nombre.toLowerCase())
    );

    setArticulosVentaRecomendados(articulosRecomendados);

    let articulo = articulosVenta.find(articulo => articulo.nombre === nombre);

    if (articulo) {
      detallesStock[index].articuloVenta = articulo;
    }
  };

  const añadirCampoArticulo = () => {
    setArticulosVentaInputs([...articulosVentaInputs, {
      id: 0, tipo: '', medida: '', cantidad: 0, cantidadMedida: 0, nombre: '', precioVenta: 0,
      imagenes: [], imagenesDTO: [], promociones: []
    }]);
  };

  const quitarCampoArticulo = () => {
    if (articulosVentaInputs.length > 0) {
      const nuevosArticulos = [...articulosVentaInputs];
      nuevosArticulos.pop();
      setArticulosVentaInputs(nuevosArticulos);
    }
  };

  async function agregarStockEntrante() {
    if (!fecha || detallesStock.length === 0) {
      toast.info("Por favor, complete todos los campos requeridos.");
      return;
    }

    const stockEntrante: StockEntrante = new StockEntrante();

    stockEntrante.fechaLlegada = fecha;
    stockEntrante.detallesStock = detallesStock;

    toast.promise(StockEntranteService.createStock(stockEntrante), {
      loading: 'Creando stock entrante...',
      success: (message) => {
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
      <br />
      <input type="date" placeholder="Fecha" onChange={(e) => { setFecha(new Date(e.target.value)) }} />
      <br />
      {ingredientesInputs.map(() => (
        <div className='div-ingrediente-menu'>
          <input
            type="text"
            placeholder="Nombre ingrediente"
            onChange={(e) => almacenarIngrediente(lastIndexDetalle, e.target.value)}
          />
          <ul className='lista-recomendaciones'>
            {ingredientesRecomendados?.map((ingrediente, index) => (
              <li className='opcion-recomendada' key={index} onClick={() => {
                almacenarIngrediente(lastIndexDetalle, ingrediente.nombre)
                setIngredientesRecomendados([])
              }}>
                {ingrediente.nombre}
              </li>
            ))}
          </ul>
          <input
            type="number"
            placeholder="Cantidad del ingrediente"
            onChange={(e) => almacenarCantidad(lastIndexDetalle, parseFloat(e.target.value))}
          />
          <input
            type="number"
            placeholder="Costo unitario"
            onChange={(e) => almacenarSubTotal(lastIndexDetalle, parseFloat(e.target.value))}
          />

          <p onClick={quitarCampoIngrediente}>X</p>
        </div>
      ))}
      <button onClick={añadirCampoIngrediente}>Añadir ingrediente</button>

      <br />

      {articulosVentaInputs.map(() => (
        <div className='div-ingrediente-menu'>
          <input
            type="text"
            placeholder="Nombre articulo"
            onChange={(e) => almacenarArticulo(lastIndexDetalle, e.target.value)}
          />
          <ul className='lista-recomendaciones'>
            {articulosVentaRecomendados?.map((articulo, index) => (
              <li className='opcion-recomendada' key={index} onClick={() => {
                almacenarArticulo(lastIndexDetalle, articulo.nombre)
                setArticulosVentaRecomendados([])
              }}>
                {articulo.nombre}
              </li>
            ))}
          </ul>
          <input
            type="number"
            placeholder="Cantidad del articulo"
            onChange={(e) => almacenarCantidad(lastIndexDetalle, parseFloat(e.target.value))}
          />
          <input
            type="number"
            placeholder="Costo unitario"
            onChange={(e) => almacenarSubTotal(lastIndexDetalle, parseFloat(e.target.value))}
          />

          <p onClick={quitarCampoArticulo}>X</p>
        </div>
      ))}
      <button onClick={añadirCampoArticulo}>Añadir articulo</button>

      <button type="button" onClick={agregarStockEntrante}>Agregar stock entrante</button>
    </div >
  )
}

export default AgregarStockEntrante
