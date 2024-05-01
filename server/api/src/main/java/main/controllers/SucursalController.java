package main.controllers;

import main.controllers.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Restaurante.Empleado;
import main.entities.Restaurante.Sucursal;
import main.repositories.ClienteRepository;
import main.repositories.EmpleadoRepository;
import main.repositories.SucursalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    public Sucursal crearSucursal(@RequestBody Sucursal sucursalDetails) throws Exception {
        Sucursal sucursalDB = sucursalRepository.findByEmail(sucursalDetails.getEmail());

        if (sucursalDB != null) {
            Sucursal sucursal = Sucursal.builder()
                    .contraseña(Encrypt.cifrarPassword(sucursalDetails.getContraseña()))
                    .borrado("NO")
                    .privilegios("empleado")
                    .domicilio(sucursalDetails.getDomicilio())
                    .telefono(sucursalDetails.getTelefono())
                    .horarioApertura(sucursalDetails.getHorarioApertura())
                    .horarioCierre(sucursalDetails.getHorarioCierre())
                    .build();

            sucursalRepository.save(sucursal);

            return sucursal;
        } else {
            return null;
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
