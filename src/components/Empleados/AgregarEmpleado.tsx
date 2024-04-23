import { useState } from 'react';
import { Empleado } from '../../types/Empleado';
import { EmpleadoService } from '../../services/EmpleadoService';
import { clearInputs } from '../../utils/global_variables/clearInputs';

function AgregarEmpleado() {

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [cuit, setCuit] = useState(0);
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState(0);

  async function agregarEmpleado() {
    const empleado: Empleado = new Empleado();

    empleado.nombre = `${nombre} ${apellido}`;
    empleado.email = email;
    empleado.contraseña = contraseña;
    empleado.telefono = telefono;
    empleado.cuit = cuit;

    let response = await EmpleadoService.createEmpleado(empleado);
    
    alert(response);

    clearInputs();
  }

  return (
    <div className="modal-info">
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Nombre del empleado" id="nombreEmpleado" onChange={(e) => { setNombre(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Apellido del empleado" id="apellidoEmpleado" onChange={(e) => { setApellido(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Email del empleado" id="emailEmpleado" onChange={(e) => { setEmail(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Cuit del empleado" id="cuitEmpleado" onChange={(e) => { setCuit(parseInt(e.target.value)) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Contraseña del empleado" id="contraseñaEmpleado" onChange={(e) => { setContraseña(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Telefono del empleado" id="telefonoEmpleado" onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
      </label>
      <br />
      <input type="button" value="Agregar empleado" id="agregarEmpleado" onClick={agregarEmpleado} />
    </div>
  )
}

export default AgregarEmpleado
