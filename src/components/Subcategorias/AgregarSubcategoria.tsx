import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import ModalFlotanteRecomendacionesCategoria from '../../hooks/ModalFlotanteFiltroCategorias';
import InputComponent from '../InputFiltroComponent';
import { Categoria } from '../../types/Ingredientes/Categoria';
import { CategoriaService } from '../../services/CategoriaService';

function AgregarSubcategoria() {

  const [categoria, setCategoria] = useState<Categoria>();
  const [nombreSubcategoria, setNombreSubcategoria] = useState<string>('');

  const [modalBusquedaCategoria, setModalBusquedaCategoria] = useState<boolean>(false);

  const handleModalClose = () => {
    setModalBusquedaCategoria(false);
  };


  async function agregarCategoria() {
    const subcategoria: Subcategoria = new Subcategoria();

    if (!categoria) {
      toast.info("Por favor, es necesaria la categoria");
      return;
    } else if (!nombreSubcategoria) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    subcategoria.nombre = nombreSubcategoria;
    subcategoria.borrado = 'NO';

    let subcategoriaExistente = categoria.subcategorias.find(subcategoria => subcategoria.nombre === nombreSubcategoria);

    // Si no existe, crear una nueva subcategoría y agregarla
    if (!subcategoriaExistente) {
      categoria.subcategorias.push(subcategoria);
    }

    toast.promise(CategoriaService.updateCategoriaBorrado(categoria), {
      loading: 'Creando subcategoria...',
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
      <h2>&mdash; Cargar nueva subcategoria &mdash;</h2>
      <Toaster />
      <div>
        <label style={{ display: 'flex', fontWeight: 'bold' }}>Categoría:</label>
        <InputComponent disabled={false} placeHolder={'Filtrar categorias...'} onInputClick={() => setModalBusquedaCategoria(true)} selectedProduct={categoria?.nombre ?? ''} />
        {modalBusquedaCategoria && <ModalFlotanteRecomendacionesCategoria datosOmitidos={categoria?.nombre ?? ''} onCloseModal={handleModalClose} onSelectCategoria={(categoria) => { setCategoria(categoria); handleModalClose(); }} />}
      </div>
      <div className="inputBox">
        <input type="text" required={true} value={nombreSubcategoria} onChange={(e) => { setNombreSubcategoria(e.target.value) }} />
        <span>Nombre de la subcategoria</span>
      </div>
      <button value="Agregar categoria" id="agregarCategoria" onClick={agregarCategoria}>Cargar</button>
    </div>
  )
}

export default AgregarSubcategoria
