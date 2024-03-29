package main.controllers;

import main.controllers.EncryptMD5.Encrypt;
import main.entities.Pedidos.Pedido;
import main.entities.Restaurante.Restaurante;
import main.repositories.PedidoRepository;
import main.repositories.RestauranteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Base64;
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

    @PostMapping("/restaurant/create")
    public ResponseEntity<Restaurante> crearRestaurante(@RequestBody Restaurante restaurante) throws IOException {
        Optional<Restaurante> rest = restauranteRepository.findByEmail(email);
        if (rest.isEmpty()) {
            Restaurante restauranteDetails = new Restaurante();
            restauranteDetails.setNombre(nombre);
            restauranteDetails.setEmail(email);
            // Encripto la contraseña con MD5
            restauranteDetails.setContraseña(Encrypt.encryptPassword(contraseña));
            restauranteDetails.setDomicilio(domicilio);
            restauranteDetails.setTelefono(telefono);
            restauranteDetails.setPrivilegios("negocio");

            restauranteRepository.save(restauranteDetails);
            return ResponseEntity.ok(restauranteDetails);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @CrossOrigin
    @PostMapping("/restaurant/login/{email}/{password}")
    public ResponseEntity<Restaurante> loginRestaurante(@PathVariable("email") String email, @PathVariable("password") String password) {
        // Busco por email y clave encriptada, si se encuentra envio un ok
        Optional<Restaurante> restauranteOptional = restauranteRepository.findByEmailAndPassword(email, Encrypt.encryptPassword(password));
        if (restauranteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(restauranteOptional.get());
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
