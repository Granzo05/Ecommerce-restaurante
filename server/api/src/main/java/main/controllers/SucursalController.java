package main.controllers;

import jakarta.transaction.Transactional;
import main.controllers.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.Domicilio;
import main.entities.Restaurante.Empleado;
import main.entities.Restaurante.LocalidadDelivery;
import main.entities.Restaurante.Sucursal;
import main.repositories.ClienteRepository;
import main.repositories.EmpleadoRepository;
import main.repositories.SucursalRepository;
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

    public SucursalController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, ClienteRepository clienteRepository) {
        this.sucursalRepository = sucursalRepository;
        this.empleadoRepository = empleadoRepository;
        this.clienteRepository = clienteRepository;
    }

    @CrossOrigin
    @GetMapping("/sucursal/login/{email}/{password}")
    public Object loginSucursal(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        // Busco por email y clave encriptada, si se encuentra devuelvo el objeto
        Sucursal sucursal = sucursalRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
        // Utilizo la misma funcion tanto para empleados como para el sucursale
        if (sucursal == null) {
            return empleadoRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
        }

        return sucursal;
    }

    @CrossOrigin
    @GetMapping("/sucursales")
    public Set<Sucursal> getSucursales() throws Exception {
        Set sucursales = new HashSet<>(sucursalRepository.findAllNoBorrado());

        return sucursales;
    }

    @PutMapping("/sucursal/update")
    public ResponseEntity<Sucursal> actualizarSucursal(@PathVariable Long id, @RequestBody Sucursal sucursal) {
        Optional<Sucursal> sucursaleEncontrado = sucursalRepository.findById(id);
        if (sucursaleEncontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        //Todo: Setters

        Sucursal sucursalFinal = sucursalRepository.save(sucursal);

        return ResponseEntity.ok(sucursalFinal);
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

            for(LocalidadDelivery localidadDelivery: sucursalDetails.getLocalidadesDisponiblesDelivery()) {
                LocalidadDelivery newLocalidad = new LocalidadDelivery();
                newLocalidad.setSucursal(sucursalDetails);
                newLocalidad.setLocalidad(localidadDelivery.getLocalidad());
                localidades.add(newLocalidad);
            }

            sucursalDetails.setLocalidadesDisponiblesDelivery(localidades);

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
}
