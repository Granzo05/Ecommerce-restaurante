import { EmpleadoService } from "../services/EmpleadoService";

const Stock = () => {
    EmpleadoService.checkUser('empleado');

  return (
        <div>
            <div id="modal-añadir" className="modal">
                <div className="modal-content">
                    <label>
                        <input type="text" placeholder="Nombre del ingrediente" id="nombreIngrediente" />
                    </label>
                    <br />
                    <label>
                        <i className='bx bx-lock'></i>
                        <input type="text" placeholder="Cantidad" id="cantidadIngredienteAñadir" />
                    </label>
                    <br />
                    <label>
                        <select id="medidaIngredienteAñadir" name="medidaIngrediente">
                            <option value="Medida" disabled>Medida</option>
                            <option value="kilogramos">KG</option>
                            <option value="litros">LITROS</option>
                            <option value="gramos">GRAMOS</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        <i className='bx bx-price'></i>
                        <input type="number" placeholder="Costo del ingrediente" id="costoIngredienteAñadir" />
                    </label>
                    <br />
                    <input type="button" value="añadirIngrediente" id="añadirIngrediente" onClick={agregarStock} />
                </div>
            </div>

            <div id="modal-editar" className="modal">
                <div className="modal-content">
                    <label>
                        <select id="select-nombre-ingrediente-actualizar" name="nombreIngredienteActualizar">
                        </select>
                    </label>
                    <br />
                    <label>
                        <input type="text" placeholder="Cantidad" id="cantidadIngredienteActualizar" />
                    </label>
                    <br />
                    <label>
                        <select id="medidaIngredienteActualizar" name="medidaIngrediente">
                            <option value="kilogramos">KG</option>
                            <option value="litros">LITROS</option>
                            <option value="gramos">GRAMOS</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        <input type="number" placeholder="Costo del ingrediente" id="costoIngredienteActualizar" />
                    </label>
                    <br />
                    <input type="button" value="cargarIngrediente" id="cargarIngredienteActualizar" onClick={actualizarStock} />
                </div>
            </div>

            <div id="modal-borrar" className="modal">
                <div className="modal-content">
                    <label>
                        <select id="select-nombre-ingrediente-borrar" name="nombreIngrediente">
                        </select>
                    </label>
                    <br />
                    <input type="button" value="borrarIngrediente" id="borrarIngrediente" onClick={eliminarStock}/>
                </div>
            </div>

            <div className="container">
                <h1 className="title">Ingredientes</h1>
                <div id="ingredientes"></div>
            </div>
        </div>
  )
}

export default Stock
