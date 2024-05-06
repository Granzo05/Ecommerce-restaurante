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
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class SucursalController {
    private final SucursalRepository sucursalRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;
    private final LocalidadDeliveryRepository localidadDeliveryRepository;

    public SucursalController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, ClienteRepository clienteRepository, EmpresaRepository empresaRepository, LocalidadDeliveryRepository localidadDeliveryRepository) {
        this.sucursalRepository = sucursalRepository;
        this.empleadoRepository = empleadoRepository;
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
        this.localidadDeliveryRepository = localidadDeliveryRepository;
    }

    @CrossOrigin
    @GetMapping("/sucursal/login/{email}/{password}")
    public Object loginSucursal(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        // Busco por email y clave encriptada, si se encuentra devuelvo el objeto
        SucursalDTO sucursal = sucursalRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
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

        for (SucursalDTO sucursalDTO : sucursales) {
            DomicilioDTO domicilioDTO = new DomicilioDTO();

            domicilioDTO.setCalle(sucursalDTO.getDomicilio().getCalle());
            domicilioDTO.setLocalidad(sucursalDTO.getDomicilio().getLocalidad());
            domicilioDTO.setNumero(sucursalDTO.getDomicilio().getNumero());
            domicilioDTO.setCodigoPostal(sucursalDTO.getDomicilio().getCodigoPostal());

            sucursalDTO.setDomicilio(domicilioDTO);
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

            domicilio.setCalle(sucursalDetails.getDomicilio().getCalle());
            domicilio.setLocalidad(sucursalDetails.getDomicilio().getLocalidad());
            domicilio.setNumero(sucursalDetails.getDomicilio().getNumero());
            domicilio.setSucursal(sucursalDetails);
            domicilio.setCodigoPostal(sucursalDetails.getDomicilio().getCodigoPostal());

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

    @PostMapping("/empleado/create")
    public Empleado crearEmpleado(@RequestBody Empleado empleadoDetails) throws Exception {
        Optional<Empleado> empleadoDB = empleadoRepository.findByEmail(empleadoDetails.getEmail());

        if (empleadoDB.isEmpty()) {
            Empleado empleado = Empleado.builder()
                    .contraseña(Encrypt.cifrarPassword(empleadoDetails.getContraseña()))
                    .borrado("NO")
                    .privilegios("empleado")
                    .cuil(Encrypt.encriptarString(empleadoDetails.getCuil()))
                    .sucursal(empleadoDetails.getSucursal())
                    .build();

            for (Domicilio domicilio : empleadoDetails.getDomicilios()) {
                domicilio.setEmpleado(empleadoDetails);
            }

            empleadoRepository.save(empleado);

            return empleado;
        } else {
            return null;
        }
    }

    @GetMapping("/empleados")
    public List<Empleado> getEmpleados() {
        return empleadoRepository.findAll();
    }

    @PutMapping("/empleado/update")
    public ResponseEntity<String> updateEmpleado(@RequestBody Empleado empleadoDetails) throws Exception {
        Empleado empleado = empleadoRepository.findByCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));
        if (empleado != null) {
            empleado.setNombre(empleadoDetails.getNombre());
            empleado.setContraseña(Encrypt.cifrarPassword(empleadoDetails.getContraseña()));
            empleado.setCuil(empleadoDetails.getCuil());
            empleado.setEmail(empleadoDetails.getEmail());
            empleado.setTelefono(empleadoDetails.getTelefono());

            empleadoRepository.save(empleado);
            return ResponseEntity.ok("El empleado se modificó correctamente");
        } else {
            return ResponseEntity.ok("El empleado no se encontró");
        }
    }

    @PutMapping("/empleado/{cuit}/delete")
    public ResponseEntity<String> deleteEmpleado(@PathVariable("cuit") String cuit) throws Exception {
        Empleado empleado = empleadoRepository.findByCuil(Encrypt.encriptarString(cuit));

        if (empleado != null) {
            empleado.setBorrado("SI");
            empleadoRepository.save(empleado);
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
}
