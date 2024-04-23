package main.controllers;

import main.controllers.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Restaurante.Empleado;
import main.entities.Restaurante.Restaurante;
import main.repositories.ClienteRepository;
import main.repositories.EmpleadoRepository;
import main.repositories.PedidoRepository;
import main.repositories.RestauranteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
public class RestauranteController {
    private final RestauranteRepository restauranteRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ClienteRepository clienteRepository;
    public RestauranteController(RestauranteRepository restauranteRepository, EmpleadoRepository empleadoRepository, ClienteRepository clienteRepository) {
        this.restauranteRepository = restauranteRepository;
        this.empleadoRepository = empleadoRepository;
        this.clienteRepository = clienteRepository;
    }

    @PostMapping("/restaurante/create")
    public Restaurante crearRestaurante(@RequestBody Restaurante restaurante) throws Exception {
        try {
            restaurante.setContraseña(Encrypt.cifrarPassword(restaurante.getContraseña()));
            restaurante.setPrivilegios("negocio");

            restauranteRepository.save(restaurante);
            return restaurante;
        } catch (Exception e) {
            return null;
        }

    }

    @CrossOrigin
    @GetMapping("/restaurant/login/{email}/{password}")
    public Object loginRestaurante(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        // Busco por email y clave encriptada, si se encuentra devuelvo el objeto
        Restaurante restaurante = restauranteRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
        // Utilizo la misma funcion tanto para empleados como para el restaurante
        if (restaurante == null) {
            return empleadoRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
        }

        return restaurante;
    }

    @PutMapping("/restaurant/update")
    public ResponseEntity<Restaurante> actualizarRestaurante(@PathVariable Long id, @RequestBody Restaurante restaurante) {
        Optional<Restaurante> restauranteEncontrado = restauranteRepository.findById(id);
        if (restauranteEncontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        //Todo: Setters

        Restaurante restauranteFinal = restauranteRepository.save(restaurante);

        return ResponseEntity.ok(restauranteFinal);
    }

    @CrossOrigin
    @GetMapping("/check/{email}")
    public boolean checkPrivilegios(@PathVariable("email") String email) {
        Restaurante restaurante = restauranteRepository.findByEmail(email);

        // Restaurante tiene acceso a todo, por lo tanto si el email coincide entonces se concede acceso
        if (restaurante != null) {
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

    @PostMapping("/empleado/create")
    public Empleado crearEmpleado(@RequestBody Empleado empleadoDetails) throws Exception {
        Optional<Empleado> empleado = empleadoRepository.findByEmail(empleadoDetails.getEmail());
        if (empleado.isEmpty()) {
            empleadoDetails.setContraseña(Encrypt.cifrarPassword(empleadoDetails.getContraseña()));
            empleadoDetails.setBorrado("NO");
            empleadoDetails.setPrivilegios("empleado");
            empleadoDetails.setCuit(Encrypt.encriptarString(empleadoDetails.getCuit()));
            empleadoRepository.save(empleadoDetails);
            return empleadoDetails;
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
        Empleado empleado = empleadoRepository.findByCuit(Encrypt.encriptarString(empleadoDetails.getCuit()));
        if (empleado != null) {
            empleado.setNombre(empleadoDetails.getNombre());
            empleado.setContraseña(Encrypt.cifrarPassword(empleadoDetails.getContraseña()));
            empleado.setCuit(empleadoDetails.getCuit());
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
        Empleado empleado = empleadoRepository.findByCuit(Encrypt.encriptarString(cuit));

        if (empleado != null) {
            empleado.setBorrado("SI");
            empleadoRepository.save(empleado);
            return ResponseEntity.ok("El empleado se eliminó correctamente");
        } else {
            return ResponseEntity.ok("El empleado no se encontró");
        }
    }
}
