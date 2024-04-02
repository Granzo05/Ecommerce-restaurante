import { useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { Empleado } from '../../types/Empleado';

interface EditarEmpleadoProps {
  empleadoOriginal: Empleado;
}

const EditarEmpleado: React.FC<EditarEmpleadoProps> = ({ empleadoOriginal }) => {

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [cuit, setCuit] = useState(0);
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState(0);

  function editarEmpleado() {
    const empleado: Empleado = new Empleado();

    empleado.nombre = `${nombre} ${apellido}`;
    empleado.email = email;
    empleado.contraseña = contraseña;
    empleado.telefono = telefono;
    empleado.cuit = cuit;

    EmpleadoService.updateEmpleado(empleado);
  }

  return (
    <div>
      <div id="container-items">
      </div>

      <div id="miModal" className="modal">
        <div className="modal-content">
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="Nombre del empleado" value={empleadoOriginal.nombre} id="nombreEmpleado" onChange={(e) => { setNombre(e.target.value) }} />
          </label>
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="Apellido del empleado" value={empleadoOriginal.apellido} id="apellidoEmpleado" onChange={(e) => { setApellido(e.target.value) }} />
          </label>
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="Email del empleado" value={empleadoOriginal.email} id="emailEmpleado" onChange={(e) => { setEmail(e.target.value) }} />
          </label>
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="Cuit del empleado" value={empleadoOriginal.cuit} id="cuitEmpleado" onChange={(e) => { setCuit(parseInt(e.target.value)) }} />
          </label>
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="Contraseña del empleado" value={empleadoOriginal.contraseña} id="contraseñaEmpleado" onChange={(e) => { setContraseña(e.target.value) }} />
          </label>
          <br />
          <label>
            <i className='bx bx-lock'></i>
            <input type="text" placeholder="Telefono del empleado" value={empleadoOriginal.telefono} id="telefonoEmpleado" onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
          </label>
          <br />
          <input type="button" value="agregarEmpleado" id="agregarEmpleado" onClick={editarEmpleado} />
        </div>
      </div>
    </div>
  )
}

export default EditarEmpleado
