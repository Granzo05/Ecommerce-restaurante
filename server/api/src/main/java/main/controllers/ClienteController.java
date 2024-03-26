package main.controllers;

import main.controllers.EncryptMD5.Encrypt;
import main.entities.Users.User;
import main.repositories.ClienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.Optional;

@RestController
public class ClienteController {
    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @PostMapping("/user/create")
    public ResponseEntity<String> crearCliente(@RequestBody User userDetails) {
        Optional<User> cliente = clienteRepository.findByEmail(userDetails.getEmail());
        if (cliente.isEmpty()) {
            userDetails.setContraseña(Encrypt.encryptPassword(userDetails.getContraseña()));
            clienteRepository.save(userDetails);
            return new ResponseEntity<>("El usuario ha sido añadido correctamente", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("El usuario ya existe", HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @PostMapping("/user/{email}/password")
    public ResponseEntity<User> buscarCliente(@PathVariable("email") String email, @PathVariable("password") String password,) {
        // Recibo un email y una password desde el cliente, esa pass la encripto para ver si coincide con la guardada
        Optional<User> clienteOptional = clienteRepository.findByEmailAndPassword(email, Encrypt.encryptPassword(password));
        if (clienteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = clienteOptional.get();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/user/update")
    public ResponseEntity<User> updateCliente(@RequestBody User userDetails) {
        Optional<User> clienteOptional = clienteRepository.findById(id);
        if (clienteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = clienteOptional.get();

        // Todo: Agregar setters

        clienteRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    @DeleteMapping("/cliente/id/{id}/delete")
    public ResponseEntity<?> borrarCliente(@RequestBody User user) {
        Optional<User> cliente = clienteRepository.findById(user.getId());
        if (!cliente.isPresent()) {
            return new ResponseEntity<>("El usuario no existe o ya ha sido borrado", HttpStatus.BAD_REQUEST);
        }

        cliente.get().setBorrado("SI");

        clienteRepository.save(cliente.get());
        return new ResponseEntity<>("El usuario ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
