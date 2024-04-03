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
    public Object loginRestaurante(@PathVariable("email") String email, @PathVariable("password") String password) {
        // Busco por email y clave encriptada, si se encuentra envio un ok
        Restaurante restaurante = restauranteRepository.findByEmailAndPassword(email, Encrypt.encryptPassword(password));

        if(restaurante == null) {
            return empleadoRepository.findByEmailAndPassword(email, Encrypt.encryptPassword(password));
        }

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
        try{
            Optional<Cliente> cliente = clienteRepository.findByEmail(email);
            // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
            if (cliente.isPresent()) {
                return false;
            }
        } catch (Exception ignored){

        }

        try{
            Optional<Empleado> empleado = empleadoRepository.findByEmail(email);
            // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
            if (empleado.isPresent()) {
                if (empleado.get().getPrivilegios().contains(privilegioNecesario)) {
                    return true;
                }
                return true;
            }
        } catch (Exception ignored){

        }

        Restaurante restaurante = restauranteRepository.findByEmail(email);

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
        try{
            Optional<Cliente> cliente = clienteRepository.findByEmail(email);
            // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
            if (cliente.isPresent()) {
                return false;
            }
        } catch (Exception ignored){}

        try{
            Optional<Empleado> empleado = empleadoRepository.findByEmail(email);
            // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
            if (empleado.isPresent()) {
                return true;
            }
        } catch (Exception ignored){

        }

        Restaurante restaurante = restauranteRepository.findByEmail(email);

        // Restaurante tiene acceso a todo, por lo tanto si el email coincide entonces se concede acceso
        if (restaurante != null) {
            return true;
        }

        return false;
    }

    @PostMapping("/empleado/create")
    public Empleado crearEmpleado(@RequestBody Empleado empleadoDetails) {
        Optional<Empleado> empleado = empleadoRepository.findByEmail(empleadoDetails.getEmail());
        System.out.println(empleado);
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
}
