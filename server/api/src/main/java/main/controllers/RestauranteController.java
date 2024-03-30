package main.controllers;

import main.controllers.EncryptMD5.Encrypt;
import main.entities.Pedidos.Pedido;
import main.entities.Restaurante.Restaurante;
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
    private final PedidoRepository pedidoRepository;

    public RestauranteController(RestauranteRepository restauranteRepository,
                                 PedidoRepository pedidoRepository) {
        this.restauranteRepository = restauranteRepository;
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
        List<Pedido> pedidos = pedidoRepository.findOrdersAcepted();
        return pedidos;
    }

}
