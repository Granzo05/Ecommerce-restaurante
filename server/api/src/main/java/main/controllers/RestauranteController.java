package main.controllers;

import main.controllers.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Pedidos.Pedido;
import main.entities.Restaurante.Empleado;
import main.entities.Restaurante.Restaurante;
import main.repositories.ClienteRepository;
import main.repositories.EmpleadoRepository;
import main.repositories.PedidoRepository;
import main.repositories.RestauranteRepository;
import org.springframework.http.HttpStatus;
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

    private final PedidoRepository pedidoRepository;

    public RestauranteController(RestauranteRepository restauranteRepository, EmpleadoRepository empleadoRepository, ClienteRepository clienteRepository,
                                 PedidoRepository pedidoRepository) {
        this.restauranteRepository = restauranteRepository;
        this.empleadoRepository = empleadoRepository;
        this.clienteRepository = clienteRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @PostMapping("/restaurante/create")
    public Restaurante crearRestaurante(@RequestBody Restaurante restaurante) throws IOException {
        restaurante.setContraseña(Encrypt.encryptPassword(restaurante.getContraseña()));
        restaurante.setPrivilegios("negocio");

        restauranteRepository.save(restaurante);
        return restaurante;
    }
    @CrossOrigin
    @GetMapping("/restaurant/login/{email}/{password}")
    public Object loginRestaurante(@PathVariable("email") String email, @PathVariable("password") String password) {
        // Busco por email y clave encriptada, si se encuentra devuelvo el objeto
        Restaurante restaurante = restauranteRepository.findByEmailAndPassword(email, Encrypt.encryptPassword(password));
        // Utilizo la misma funcion tanto para empleados como para el restaurante
        if(restaurante == null) {
            return empleadoRepository.findByEmailAndPassword(email, Encrypt.encryptPassword(password));
        }

        System.out.println(restaurante);

        return restauranteRepository.findByEmailAndPassword(email, Encrypt.encryptPassword(password));
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
    @GetMapping("/check/{email}/{privilegio}")
    public boolean checkUser(@PathVariable("email") String email, @PathVariable("privilegio") String privilegioNecesario) {
        Restaurante restaurante = restauranteRepository.findByEmail(email);
        // Restaurante tiene acceso a todo, por lo tanto si el email coincide entonces se concede acceso
        if (restaurante != null) {
            return true;
        }

        Optional<Cliente> cliente = clienteRepository.findByEmail(email);
        // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
        if (cliente.isPresent()) {
            return false;
        }

        Optional<Empleado> empleado = empleadoRepository.findByEmail(email);
        // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
        if (empleado.isPresent()) {
            if (empleado.get().getPrivilegios().contains(privilegioNecesario)) {
                return true;
            }
            return true;
        }

        return false;
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
    public Empleado crearEmpleado(@RequestBody Empleado empleadoDetails) {
        Optional<Empleado> empleado = empleadoRepository.findByEmail(empleadoDetails.getEmail());
        if (empleado.isEmpty()){
            empleadoDetails.setContraseña(Encrypt.encryptPassword(empleadoDetails.getContraseña()));
            empleadoDetails.setBorrado("NO");
            empleadoDetails.setPrivilegios("empleado");
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
    public ResponseEntity<String> updateEmpleado(@RequestBody Empleado empleadoDetails) {
        Empleado empleado = empleadoRepository.findByCuit(empleadoDetails.getCuit());
        if (empleado != null){
            empleado.setNombre(empleadoDetails.getNombre());
            empleado.setContraseña(Encrypt.encryptPassword(empleadoDetails.getContraseña()));
            empleado.setEmail(empleadoDetails.getEmail());
            empleado.setTelefono(empleadoDetails.getTelefono());

            empleadoRepository.save(empleado);
            return ResponseEntity.ok("El empleado se modificó correctamente");
        } else {
            return ResponseEntity.ok("El empleado no se encontró");
        }
    }

    @PutMapping("/empleado/{cuit}/delete")
    public ResponseEntity<String> deleteEmpleado(@PathVariable("cuit") Long cuit) {
        Empleado empleado = empleadoRepository.findByCuit(cuit);
        System.out.println(empleado);

        if (empleado != null){
            empleado.setBorrado("SI");
            empleadoRepository.save(empleado);
            return ResponseEntity.ok("El empleado se eliminó correctamente");
        } else {
            return ResponseEntity.ok("El empleado no se encontró");
        }
    }
}
