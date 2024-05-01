import { useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { Empleado } from '../../types/Restaurante/Empleado';
import '../../styles/empleados.css';

interface EditarEmpleadoProps {
  empleadoOriginal: Empleado;
}

const EditarEmpleado: React.FC<EditarEmpleadoProps> = ({ empleadoOriginal }) => {
  const [nombre, setNombre] = useState(empleadoOriginal.nombre);
  const [apellido, setApellido] = useState(empleadoOriginal.apellido);
  const [email, setEmail] = useState(empleadoOriginal.email);
  const [cuit, setCuit] = useState(String(empleadoOriginal.cuit));
  const [contraseña, setContraseña] = useState(empleadoOriginal.contraseña);
  const [telefono, setTelefono] = useState(String(empleadoOriginal.telefono));

  async function editarEmpleado() {
    const empleadoActualizado: Empleado = {
      ...empleadoOriginal,
      nombre,
      email,
      cuit: parseInt(cuit),
      contraseña,
      telefono: parseInt(telefono)
    };
    let response = await EmpleadoService.updateEmpleado(empleadoActualizado);
    alert(response);
  }

  return (
    <div className="modal-info-editar">
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Nombre del empleado" value={nombre} id="nombreEmpleado" onChange={(e) => { setNombre(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Apellido del empleado" value={apellido} id="apellidoEmpleado" onChange={(e) => { setApellido(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Email del empleado" value={email} id="emailEmpleado" onChange={(e) => { setEmail(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Cuit del empleado" value={cuit} id="cuitEmpleado" onChange={(e) => { setCuit(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Contraseña del empleado" value={contraseña} id="contraseñaEmpleado" onChange={(e) => { setContraseña(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Telefono del empleado" value={telefono} id="telefonoEmpleado" onChange={(e) => { setTelefono(e.target.value) }} />
      </label>
      <br />
      <button type="button" id="agregarEmpleado" onClick={editarEmpleado}>Editar empleado</button>
    </div>
  )
}

export default EditarEmpleado;

