package main.controllers;

import jakarta.transaction.Transactional;
import main.controllers.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.DomicilioDTO;
import main.entities.Restaurante.*;
import main.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    public SucursalController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, ClienteRepository clienteRepository, EmpresaRepository empresaRepository, LocalidadDeliveryRepository localidadDeliveryRepository, FechaContratacionRepository fechaContratacionRepository, DomicilioRepository domicilioRepository) {
        this.sucursalRepository = sucursalRepository;
        this.empleadoRepository = empleadoRepository;
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
        this.localidadDeliveryRepository = localidadDeliveryRepository;
        this.fechaContratacionRepository = fechaContratacionRepository;
        this.domicilioRepository = domicilioRepository;
    }

    @CrossOrigin
    @GetMapping("/sucursal/login/{email}/{password}")
    public Object loginSucursal(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        // Busco por email y clave encriptada, si se encuentra devuelvo el objeto
        SucursalDTO sucursal = sucursalRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
        System.out.println(sucursal);
        // Utilizo la misma funcion tanto para empleados como para el sucursale
        if (sucursal == null) {
            return empleadoRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
        }

        return sucursal;
    }

    @CrossOrigin
    @GetMapping("/sucursales")
    public Set<SucursalDTO> getSucursales() throws Exception {
        List<SucursalDTO> sucursales = sucursalRepository.findAllNoBorrado();

        for (SucursalDTO sucursal : sucursales) {
            DomicilioDTO domicilio = domicilioRepository.findByIdSucursal(sucursal.getId());

            domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
            // Desencriptar localidad
            domicilio.getLocalidad().setNombre(Encrypt.desencriptarString(domicilio.getLocalidad().getNombre()));
            // Desencriptar departamento
            domicilio.getLocalidad().getDepartamento().setNombre(Encrypt.desencriptarString(domicilio.getLocalidad().getDepartamento().getNombre()));
            // Desencriptar provincia
            domicilio.getLocalidad().getDepartamento().getProvincia().setNombre(Encrypt.desencriptarString(domicilio.getLocalidad().getDepartamento().getProvincia().getNombre()));

            sucursal.setDomicilio(domicilio);
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
            domicilio.setSucursal(sucursalDetails);
            domicilio.setCodigoPostal(sucursalDetails.getDomicilio().getCodigoPostal());

            domicilio.setNumero(domicilio.getNumero());
            domicilio.setSucursal(sucursalDetails);
            domicilio.setLocalidad(domicilio.getLocalidad());

            sucursalDetails.setDomicilio(domicilio);

            sucursalDetails.setContraseña(Encrypt.cifrarPassword(sucursalDetails.getContraseña()));

            sucursalDetails.setHorarioApertura(LocalTime.parse(sucursalDetails.getHorarioApertura().toString()));
            sucursalDetails.setHorarioCierre(LocalTime.parse(sucursalDetails.getHorarioCierre().toString()));
            sucursalDetails.setPrivilegios("negocio");

            Set<LocalidadDelivery> localidades = new HashSet<>();

            for (LocalidadDelivery localidadDelivery : sucursalDetails.getLocalidadesDisponiblesDelivery()) {
                LocalidadDelivery newLocalidad = new LocalidadDelivery();
                newLocalidad.setSucursal(sucursalDetails);
                newLocalidad.setLocalidad(localidadDelivery.getLocalidad());
                localidades.add(newLocalidad);
            }

            sucursalDetails.setLocalidadesDisponiblesDelivery(localidades);

            Empresa empresa = empresaRepository.findById(2l).get();

            sucursalDetails.setEmpresa(empresa);

            sucursalRepository.save(sucursalDetails);

            return ResponseEntity.ok("Ok");
        } else {
            return ResponseEntity.ofNullable("Mal");
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

            for (Domicilio domicilio: empleadoDetails.getDomicilios()) {
                encriptarDomicilio(domicilio, empleadoDetails);
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
            empleadoDTO.setDomicilios(desencriptarDomicilioDTO(domicilios));
            empleadoDTO.setSucursal(sucursalRepository.findById(empleado.getId()).get());

            empleadosDTO.add(empleadoDTO);
        }

        return new HashSet<>(empleadosDTO);
    }


    @PutMapping("/empleado/update")
    public ResponseEntity<String> updateEmpleado(@RequestBody Empleado empleadoDetails) throws Exception {
        Optional<Empleado> empleadoOptional = empleadoRepository.findByCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

        if (empleadoOptional.isPresent()) {
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

            String email = empleadoDetails.getEmail();
            if (email != null && !email.isEmpty() && !Encrypt.encriptarString(email).equals(empleadoDb.getEmail())) {
                empleadoDb.setEmail(Encrypt.encriptarString(email));
            }

            // Actualizar sucursal y cuil
            if (empleadoDb.getSucursal().getId() == empleadoDetails.getSucursal().getId()) {
                empleadoDb.setSucursal(sucursalRepository.findById(empleadoDetails.getSucursal().getId()).get());
            }

            if (!Encrypt.desencriptarString(empleadoDb.getCuil()).contains(empleadoDetails.getCuil())) {
                empleadoDb.setCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));
            }

            Set<Domicilio> domiciliosEmpleadoDb = new HashSet<>(empleadoDb.getDomicilios());

            for (int i = 0; i < domiciliosEmpleadoDb.size(); i++) {
                Domicilio domicilioDb = domiciliosEmpleadoDb.stream().toList().get(i);
                Domicilio domicilioCliente = empleadoDetails.getDomicilios().stream().toList().get(i);

                if (!domicilioDb.getCalle().equals(domicilioCliente.getCalle())
                        || domicilioDb.getNumero() != domicilioCliente.getNumero()
                        || domicilioDb.getCodigoPostal() != domicilioCliente.getCodigoPostal()) {
                    // Si no coinciden los datos, almacenamos el nuevo domicilio encriptado
                    domiciliosEmpleadoDb.stream().toList().set(i, encriptarDomicilio(domicilioCliente, empleadoDb));
                }
            }

            empleadoDb.setDomicilios(domiciliosEmpleadoDb);

            empleadoRepository.save(empleadoDb);
            return ResponseEntity.ok("El empleado se modificó correctamente");
        } else {
            return ResponseEntity.ok("El empleado no se encontró");
        }
    }


    private Domicilio encriptarDomicilio(Domicilio domicilio, Object persona) throws Exception {

        domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
        domicilio.setLocalidad(domicilio.getLocalidad());

        if (persona instanceof Empleado) {
            domicilio.setEmpleado((Empleado) persona);
        } else if (persona instanceof Sucursal) {
            domicilio.setSucursal((Sucursal) persona);
        } else if (persona instanceof Cliente) {
            domicilio.setCliente((Cliente) persona);
        }

        return domicilio;
    }

    @PutMapping("/empleado/{cuil}/delete")
    public ResponseEntity<String> deleteEmpleado(@PathVariable("cuil") String cuil) throws Exception {
        Optional<Empleado> empleado = empleadoRepository.findByCuil(Encrypt.encriptarString(cuil));

        if (empleado.isPresent()) {
            empleado.get().setBorrado("SI");
            empleadoRepository.save(empleado.get());
            return ResponseEntity.ok("El empleado se eliminó correctamente");
        } else {
            return ResponseEntity.ok("El empleado no se encontró");
        }
    }

    @PutMapping("/sucursal/update")
    public ResponseEntity<String> updateSucursal(@RequestBody Sucursal sucursalDetails) throws Exception {
        Sucursal sucursal = sucursalRepository.findByIdNotBorrado(sucursalDetails.getId());

        if (sucursal != null) {
            // Update domicilio
            sucursal.getDomicilio().setCalle(sucursalDetails.getDomicilio().getCalle());
            sucursal.getDomicilio().setLocalidad(sucursalDetails.getDomicilio().getLocalidad());
            sucursal.getDomicilio().setNumero(sucursalDetails.getDomicilio().getNumero());
            sucursal.getDomicilio().setSucursal(sucursalDetails);
            sucursal.getDomicilio().setCodigoPostal(sucursalDetails.getDomicilio().getCodigoPostal());

            // Update contraseña

            if (sucursalDetails.getContraseña().length() > 1)
                sucursal.setContraseña(Encrypt.cifrarPassword(sucursalDetails.getContraseña()));

            // Update horarios

            sucursal.setHorarioApertura(LocalTime.parse(sucursalDetails.getHorarioApertura().toString()));
            sucursal.setHorarioCierre(LocalTime.parse(sucursalDetails.getHorarioCierre().toString()));

            // Borramos todas las localidades
            List<LocalidadDelivery> localidades = localidadDeliveryRepository.findByIdSucursal(sucursal.getId());
            localidadDeliveryRepository.deleteAll(localidades);

            // Limpiar la lista de localidades existentes
            localidades.clear();

            // Agregar las nuevas localidades proporcionadas en sucursalDetails
            for (LocalidadDelivery localidadDelivery : sucursalDetails.getLocalidadesDisponiblesDelivery()) {
                localidadDelivery.setSucursal(sucursal); // Establecer la sucursal para la nueva localidad
                localidades.add(localidadDelivery);
            }

            sucursal.setLocalidadesDisponiblesDelivery(new HashSet<>(localidades));

            sucursal.setEmail(sucursalDetails.getEmail());
            sucursal.setTelefono(sucursalDetails.getTelefono());

            sucursalRepository.save(sucursal);

            return ResponseEntity.ok("La sucursal se eliminó correctamente");
        } else {
            return ResponseEntity.ok("La sucursal no se encontró");
        }
    }

    @PutMapping("/sucursal/{id}/delete")
    public ResponseEntity<String> deleteSucursal(@PathVariable("id") Long id) throws Exception {
        Sucursal sucursal = sucursalRepository.findByIdNotBorrado(id);

        if (sucursal != null) {
            sucursal.setBorrado("SI");
            sucursalRepository.save(sucursal);
            return ResponseEntity.ok("La sucursal se eliminó correctamente");
        } else {
            return ResponseEntity.ok("La sucursal no se encontró");
        }
    }


    private Set<Domicilio> desencriptarDomicilio(Set<Domicilio> domicilios) throws Exception {
        for (Domicilio domicilio : domicilios) {
            try {
                // Desencriptar calle
                domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
                // Desencriptar localidad
                domicilio.getLocalidad().setNombre(Encrypt.desencriptarString(domicilio.getLocalidad().getNombre()));
                // Desencriptar departamento
                domicilio.getLocalidad().getDepartamento().setNombre(Encrypt.desencriptarString(domicilio.getLocalidad().getDepartamento().getNombre()));
                // Desencriptar provincia
                domicilio.getLocalidad().getDepartamento().getProvincia().setNombre(Encrypt.desencriptarString(domicilio.getLocalidad().getDepartamento().getProvincia().getNombre()));
            } catch (IllegalArgumentException e) {
                System.out.println(e);
            }
        }
        return domicilios;
    }

    private Set<DomicilioDTO> desencriptarDomicilioDTO(Set<DomicilioDTO> domicilios) throws Exception {
        for (DomicilioDTO domicilio : domicilios) {
            try {
                // Desencriptar calle
                domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
                // Desencriptar localidad
                domicilio.getLocalidad().setNombre(Encrypt.desencriptarString(domicilio.getLocalidad().getNombre()));
                // Desencriptar departamento
                domicilio.getLocalidad().getDepartamento().setNombre(Encrypt.desencriptarString(domicilio.getLocalidad().getDepartamento().getNombre()));
                // Desencriptar provincia
                domicilio.getLocalidad().getDepartamento().getProvincia().setNombre(Encrypt.desencriptarString(domicilio.getLocalidad().getDepartamento().getProvincia().getNombre()));
            } catch (IllegalArgumentException e) {
                System.out.println(e);
            }
        }
        return domicilios;
    }
}
