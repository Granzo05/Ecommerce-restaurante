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

    @PostMapping("/restaurante")
    public ResponseEntity<Restaurante> crearRestaurante(@RequestParam("file") MultipartFile file,
                                                        @RequestParam("nombre") String nombre,
                                                        @RequestParam("email") String email,
                                                        @RequestParam("contraseña") String contraseña,
                                                        @RequestParam("domicilio") String domicilio,
                                                        @RequestParam("telefono") long telefono,
                                                        @RequestParam("tipoDeComida") String tipoDeComida) throws IOException {
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
            // Separo la imagen en bytes
            restauranteDetails.setImagen(file.getBytes());

            restauranteRepository.save(restauranteDetails);
            return ResponseEntity.ok(restauranteDetails);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @CrossOrigin
    @PostMapping("/restaurante/login")
    public ResponseEntity<Restaurante> loginRestaurante(@RequestBody Restaurante restauranteDetails) {
        // Busco por email y clave encriptada, si se encuentra envio un ok
        Optional<Restaurante> restauranteOptional = restauranteRepository.findByEmailAndPassword(restauranteDetails.getEmail(), Encrypt.encryptPassword(restauranteDetails.getContraseña()));
        if (restauranteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Restaurante restaurante = restauranteOptional.get();
        return ResponseEntity.ok(restaurante);
    }

    @PutMapping("/restaurante/{id}")
    public ResponseEntity<Restaurante> actualizarRestaurante(@PathVariable Long id, @RequestBody Restaurante restaurante) {
        Optional<Restaurante> restauranteEncontrado = restauranteRepository.findById(id);
        if (restauranteEncontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

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
