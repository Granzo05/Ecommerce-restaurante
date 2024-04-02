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
        restaurante.setPrivilegios("negocio");
        restauranteRepository.save(restaurante);
        return restaurante;
    }
    @CrossOrigin
    @GetMapping("/restaurant/login/{email}/{password}")
    public Restaurante loginRestaurante(@PathVariable("email") String email, @PathVariable("password") String password) {
        // Busco por email y clave encriptada, si se encuentra envio un ok
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

    // Una vez que el admin acepta el pedido se envia a la cocina
    @GetMapping("/restaurante/cocina")
    public List<Pedido> getPedidosEntrantesACocina() {
        List<Pedido> pedidos = pedidoRepository.findPedidosEntrantes();
        return pedidos;
    }
    @CrossOrigin
    @GetMapping("/check/{email}/{privilegio}")
    public boolean checkUser(@PathVariable("email") String email, @PathVariable("privilegio") String privilegioNecesario) {
        // Recibo un email y para chequear si se puede dar acceso o no
        Cliente cliente = clienteRepository.findByEmail(email).get();

        Empleado empleado = empleadoRepository.findByEmail(email).get();

        Restaurante restaurante = restauranteRepository.findByEmail(email);

        // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
        if (cliente != null) {
            return false;
        }

        // Si privilegiosNecesario = empleado: true
        if (empleado.getPrivilegios().contains(privilegioNecesario)) {
            return true;
        }

        // Restaurante tiene acceso a todo, por lo tanto si el email coincide entonces se concede acceso
        if (restaurante != null) {
            return true;
        }

        return false;
    }

    @CrossOrigin
    @GetMapping("/check/{email}")
    public boolean checkPrivilegios(@PathVariable("email") String email) {
        // Recibo un email y para chequear si se puede dar acceso o no
        Cliente cliente = clienteRepository.findByEmail(email).get();

        Empleado empleado = empleadoRepository.findByEmail(email).get();

        Restaurante restaurante = restauranteRepository.findByEmail(email);

        // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
        if (cliente != null) {
            return false;
        }

        // Si privilegiosNecesario = empleado: true
        if (empleado != null) {
            return true;
        }

        // Restaurante tiene acceso a todo, por lo tanto si el email coincide entonces se concede acceso
        if (restaurante != null) {
            return true;
        }

        return false;
    }

    @PostMapping("/empleado/create")
    public Empleado crearEmpleado(@RequestBody Empleado empleadoDetails) {
        Empleado empleado = empleadoRepository.findByEmail(empleadoDetails.getEmail()).get();

        if (empleado != null){
            empleado.setContraseña(Encrypt.encryptPassword(empleadoDetails.getContraseña()));
            empleado.setBorrado("NO");
            empleado.setPrivilegios("empleado");
            empleadoRepository.save(empleado);
            return empleado;
        } else {
            return null;
        }
    }
}
