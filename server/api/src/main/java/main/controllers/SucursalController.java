package main.controllers;

import jakarta.transaction.Transactional;
import main.controllers.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.*;
import main.entities.Restaurante.*;
import main.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.IllegalBlockSizeException;
import java.time.LocalTime;
import java.util.*;

@RestController
public class SucursalController {
    private final SucursalRepository sucursalRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;
    private final LocalidadDeliveryRepository localidadDeliveryRepository;
    private final FechaContratacionRepository fechaContratacionRepository;
    private final DomicilioRepository domicilioRepository;
    private final LocalidadRepository localidadRepository;
    private final DepartamentoRepository departamentoRepository;
    private final ProvinciaRepository provinciaRepository;

    public SucursalController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, ClienteRepository clienteRepository, EmpresaRepository empresaRepository, LocalidadDeliveryRepository localidadDeliveryRepository, FechaContratacionRepository fechaContratacionRepository, DomicilioRepository domicilioRepository, LocalidadRepository localidadRepository, DepartamentoRepository departamentoRepository, ProvinciaRepository provinciaRepository) {
        this.sucursalRepository = sucursalRepository;
        this.empleadoRepository = empleadoRepository;
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
        this.localidadDeliveryRepository = localidadDeliveryRepository;
        this.fechaContratacionRepository = fechaContratacionRepository;
        this.domicilioRepository = domicilioRepository;
        this.localidadRepository = localidadRepository;
        this.departamentoRepository = departamentoRepository;
        this.provinciaRepository = provinciaRepository;
    }

    @CrossOrigin
    @GetMapping("/sucursal/login/{email}/{password}")
    public SucursalDTO loginSucursal(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        return sucursalRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
    }

    @CrossOrigin
    @GetMapping("/sucursales")
    public Set<SucursalDTO> getSucursales() throws Exception {
        List<SucursalDTO> sucursales = sucursalRepository.findAllDTO();

        for (SucursalDTO sucursal : sucursales) {
            DomicilioDTO domicilio = domicilioRepository.findByIdSucursal(sucursal.getId());

            domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));

            sucursal.setDomicilio(domicilio);
            sucursal.setLocalidadesDisponiblesDelivery(localidadDeliveryRepository.findByIdSucursal(sucursal.getId()));
        }

        return new HashSet<>(sucursales);
    }

    @CrossOrigin
    @GetMapping("/localidades/delivery/sucursal/{id}")
    public Set<LocalidadDelivery> getLocalidadesDeliverySucursal(@PathVariable("id") Long id) throws Exception {
        List<LocalidadDelivery> localidades = sucursalRepository.findLocalidadesByIdSucursal(id);

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/check/{email}")
    public boolean checkPrivilegios(@PathVariable("email") String email) {
        Sucursal sucursal = sucursalRepository.findByEmail(email);

        // Sucursal tiene acceso a todo, por lo tanto si el email coincide entonces se concede acceso
        if (sucursal != null) {
            return true;
        }

        // Recibo un email y para chequear si se puede dar acceso o no
        Optional<Cliente> cliente = clienteRepository.findByEmail(email);
        // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
        if (cliente.isPresent()) {
            return false;
        }

        Optional<Empleado> empleado = empleadoRepository.findByEmail(email);
        // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
        if (empleado.isPresent()) {
            return true;
        }

        return false;
    }

    @PostMapping("/sucursal/create")
    @Transactional
    public ResponseEntity<String> crearSucursal(@RequestBody Sucursal sucursalDetails) throws Exception {
        Sucursal sucursalDB = sucursalRepository.findByEmail(sucursalDetails.getEmail());

        if (sucursalDB == null) {
            Domicilio domicilio = new Domicilio();
            domicilio.setCalle(Encrypt.encriptarString(sucursalDetails.getDomicilio().getCalle()));
            domicilio.setLocalidad(sucursalDetails.getDomicilio().getLocalidad());
            domicilio.setNumero(sucursalDetails.getDomicilio().getNumero());
            domicilio.setCodigoPostal(sucursalDetails.getDomicilio().getCodigoPostal());
            domicilio.setSucursal(sucursalDetails);

            sucursalDetails.setDomicilio(domicilio);

            sucursalDetails.setContraseña(Encrypt.cifrarPassword(sucursalDetails.getContraseña()));

            sucursalDetails.setHorarioApertura(LocalTime.parse(sucursalDetails.getHorarioApertura().toString()));
            sucursalDetails.setHorarioCierre(LocalTime.parse(sucursalDetails.getHorarioCierre().toString()));
            sucursalDetails.setPrivilegios("negocio");

            Empresa empresa = empresaRepository.findById(1l).get();

            sucursalDetails.setEmpresa(empresa);

            for (LocalidadDelivery localidad: sucursalDetails.getLocalidadesDisponiblesDelivery()) {
                localidad.setSucursal(sucursalDetails);
            }

            sucursalRepository.save(sucursalDetails);

            return ResponseEntity.ok("Carga con éxito");
        } else {
            return ResponseEntity.ofNullable("Hay una sucursal cargada con ese correo");
        }
    }

    @Transactional
    @PostMapping("/empleado/create")
    public ResponseEntity<String> crearEmpleado(@RequestBody Empleado empleadoDetails) throws Exception {
        Optional<Empleado> empleadoDB = empleadoRepository.findByCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

        if (empleadoDB.isEmpty()) {
            empleadoDetails.setNombre(Encrypt.encriptarString(empleadoDetails.getNombre()));

            empleadoDetails.setEmail(Encrypt.encriptarString(empleadoDetails.getEmail()));

            empleadoDetails.setContraseña(Encrypt.cifrarPassword(empleadoDetails.getContraseña()));

            for (Domicilio domicilio : empleadoDetails.getDomicilios()) {
                domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
            }

            empleadoDetails.setSucursal(sucursalRepository.findById(empleadoDetails.getSucursal().getId()).get());
            empleadoDetails.setCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

            FechaContratacionEmpleado fecha = new FechaContratacionEmpleado();
            fecha.setEmpleado(empleadoDetails);
            empleadoDetails.getFechaContratacion().add(fecha);

            empleadoRepository.save(empleadoDetails);

            return ResponseEntity.ok("Carga con exito");
        } else {
            return ResponseEntity.ofNullable("Ya existe un empleado con ese cuil");
        }
    }

    @GetMapping("/empleados")
    public Set<EmpleadoDTO> getEmpleados() throws Exception {

        List<Empleado> empleados = empleadoRepository.findAllDTO();

        List<EmpleadoDTO> empleadosDTO = new ArrayList<>();

        for (Empleado empleado : empleados) {
            EmpleadoDTO empleadoDTO = new EmpleadoDTO();

            List<FechaContratacionEmpleadoDTO> fechasContratacion = fechaContratacionRepository.findByIdEmpleado(empleado.getId());
            empleadoDTO.setFechaContratacionEmpleado(new HashSet<>(fechasContratacion));

            empleadoDTO.setNombre(Encrypt.desencriptarString(empleado.getNombre()));
            empleadoDTO.setEmail(Encrypt.desencriptarString(empleado.getEmail()));
            empleadoDTO.setTelefono(empleado.getTelefono());
            empleadoDTO.setId(empleado.getId());
            empleadoDTO.setCuil(Encrypt.desencriptarString(empleado.getCuil()));
            empleadoDTO.setFechaNacimiento(empleado.getFechaNacimiento());

            Set<DomicilioDTO> domicilios = new HashSet<>(domicilioRepository.findByIdEmpleadoDTO(empleado.getId()));

            for (DomicilioDTO domicilioDTO: domicilios) {
                domicilioDTO.setCalle(Encrypt.desencriptarString(domicilioDTO.getCalle()));
            }
            empleadoDTO.setDomicilios(domicilios);
            empleadoDTO.setSucursal(sucursalRepository.findById(empleado.getId()).get());

            empleadosDTO.add(empleadoDTO);
        }

        return new HashSet<>(empleadosDTO);
    }


    @Transactional
    @PutMapping("/empleado/update")
    public ResponseEntity<String> updateEmpleado(@RequestBody Empleado empleadoDetails) throws Exception {
        Optional<Empleado> empleadoOptional = empleadoRepository.findById(empleadoDetails.getId());

        if (empleadoOptional.isPresent() && empleadoOptional.get().getBorrado().equals(empleadoDetails.getBorrado())) {
            // Comparo cada uno de los datos a ver si ha cambiado, ya que clienteDetails viene de un DTO y no contiene los mismos datos del empleadoDB entonces hay valores nulos
            Empleado empleadoDb = empleadoOptional.get();

            String contraseña = empleadoDetails.getContraseña();
            if (contraseña != null && !contraseña.isEmpty() && !Encrypt.cifrarPassword(contraseña).equals(empleadoDb.getContraseña())) {
                empleadoDb.setContraseña(Encrypt.cifrarPassword(contraseña));
            }

            String nombre = empleadoDetails.getNombre();
            if (nombre != null && !nombre.isEmpty() && !Encrypt.encriptarString(nombre).equals(empleadoDb.getNombre())) {
                empleadoDb.setNombre(Encrypt.encriptarString(nombre));
            }

            Long telefono = empleadoDetails.getTelefono();
            if (telefono != null && !telefono.equals(empleadoDb.getTelefono())) {
                empleadoDb.setTelefono(telefono);
            }

            String email = empleadoDetails.getEmail();
            if (email != null && !email.isEmpty() && !Encrypt.encriptarString(email).equals(empleadoDb.getEmail())) {
                empleadoDb.setEmail(Encrypt.encriptarString(email));
            }

            Date fechaNacimiento = empleadoDetails.getFechaNacimiento();
            if (fechaNacimiento != null && !fechaNacimiento.equals(empleadoDb.getFechaNacimiento())) {
                empleadoDb.setFechaNacimiento(fechaNacimiento);
            }

            // Actualizar sucursal y cuil
            if (empleadoDb.getSucursal().getId() == empleadoDetails.getSucursal().getId()) {
                empleadoDb.setSucursal(sucursalRepository.findById(empleadoDetails.getSucursal().getId()).get());
            }
            if (!Encrypt.desencriptarString(empleadoDb.getCuil()).equals(empleadoDetails.getCuil())) {
                empleadoDb.setCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));
            }

            Set<Domicilio> domiciliosEmpleadoDb = new HashSet<>(domicilioRepository.findByIdEmpleado(empleadoDb.getId()));

            // Iterar sobre los domicilios originales
            for (Domicilio domicilioDb : domiciliosEmpleadoDb) {
                // Buscar el domicilio correspondiente en los nuevos datos
                for (Domicilio domicilio : empleadoDetails.getDomicilios()) {
                    // Si se encuentra el domicilio correspondiente
                    // Comparar los campos para ver si han cambiado
                    if (!Encrypt.desencriptarString(domicilioDb.getCalle()).equals(domicilio.getCalle())
                            || domicilioDb.getNumero() != domicilio.getNumero()
                            || domicilioDb.getCodigoPostal() != domicilio.getCodigoPostal()
                            || !domicilioDb.getLocalidad().getId().equals(domicilio.getLocalidad().getId())) {
                        // Actualizar los campos del domicilio original
                        domicilioDb.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
                        domicilioDb.setNumero(domicilio.getNumero());
                        domicilioDb.setCodigoPostal(domicilio.getCodigoPostal());
                        Localidad localidad = localidadRepository.findById(domicilio.getLocalidad().getId()).get();

                        Departamento departamento = departamentoRepository.findById(domicilio.getLocalidad().getDepartamento().getId()).get();
                        domicilioDb.getLocalidad().setDepartamento(departamento);
                        localidad.setDepartamento(departamento);

                        Provincia provincia = provinciaRepository.findById(domicilio.getLocalidad().getDepartamento().getProvincia().getId()).get();
                        domicilioDb.getLocalidad().getDepartamento().setProvincia(provincia);
                        localidad.getDepartamento().setProvincia(provincia);

                        domicilioDb.setLocalidad(localidad);
                    }
                }
            }

            empleadoRepository.save(empleadoDb);


            return ResponseEntity.ok("El empleado se modificó correctamente");
        } else if(empleadoOptional.isPresent() && !empleadoOptional.get().getBorrado().equals(empleadoDetails.getBorrado())) {
            empleadoOptional.get().setBorrado(empleadoDetails.getBorrado());

            empleadoRepository.save(empleadoOptional.get());

            return ResponseEntity.ok("El empleado se modificó correctamente");
        }

        return ResponseEntity.ok("El empleado no se encontró");

    }

    @Transactional
    @PutMapping("/sucursal/update")
    public ResponseEntity<String> updateSucursal(@RequestBody Sucursal sucursalDetails) throws Exception {
        Optional<Sucursal> sucursalDb = sucursalRepository.findById(sucursalDetails.getId());
        System.out.println(sucursalDetails.getId());

        if (sucursalDb.isPresent()) {
            Sucursal sucursal = sucursalDb.get();

            if (sucursal.getBorrado().equals(sucursalDetails.getBorrado())) {
                // Actualizar domicilio
                sucursal.getDomicilio().setCalle(Encrypt.encriptarString(sucursalDetails.getDomicilio().getCalle()));
                sucursal.getDomicilio().setLocalidad(sucursalDetails.getDomicilio().getLocalidad());
                sucursal.getDomicilio().setNumero(sucursalDetails.getDomicilio().getNumero());
                sucursal.getDomicilio().setSucursal(sucursalDetails);
                sucursal.getDomicilio().setCodigoPostal(sucursalDetails.getDomicilio().getCodigoPostal());

                // Actualizar contraseña
                if (sucursalDetails.getContraseña().length() > 1) {
                    sucursal.setContraseña(Encrypt.cifrarPassword(sucursalDetails.getContraseña()));
                }

                // Actualizar horarios
                sucursal.setHorarioApertura(LocalTime.parse(sucursalDetails.getHorarioApertura().toString()));
                sucursal.setHorarioCierre(LocalTime.parse(sucursalDetails.getHorarioCierre().toString()));

                // Borrar todas las localidades
                localidadDeliveryRepository.deleteAllBySucursalId(sucursal.getId());

                // Agregar nuevas localidades
                Set<LocalidadDelivery> nuevasLocalidades = new HashSet<>();
                for (LocalidadDelivery localidad : sucursalDetails.getLocalidadesDisponiblesDelivery()) {
                    localidad.setSucursal(sucursal);
                    nuevasLocalidades.add(localidad);
                }
                sucursal.setLocalidadesDisponiblesDelivery(nuevasLocalidades);

                // Actualizar otros campos
                sucursal.setEmail(sucursalDetails.getEmail());
                sucursal.setTelefono(sucursalDetails.getTelefono());

                sucursalRepository.save(sucursal);

                return ResponseEntity.ok("La sucursal se actualizó correctamente");
            } else {
                sucursal.setBorrado(sucursalDetails.getBorrado());
                sucursalRepository.save(sucursal);
                return ResponseEntity.ok("La sucursal se actualizó correctamente");
            }
        } else {
            return ResponseEntity.ok("La sucursal no se encontró");
        }
    }
}
