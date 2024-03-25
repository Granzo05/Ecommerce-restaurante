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

    @PostMapping("/cliente/añadir")
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

    @GetMapping("/cliente/id/{id}")
    public ResponseEntity<User> buscarClientePorId(@PathVariable long id) {
        Optional<User> clienteOptional = clienteRepository.findById(id);
        if (clienteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = clienteOptional.get();
        return ResponseEntity.ok(user);
    }

    @CrossOrigin
    @PostMapping("/cliente/login")
    public ResponseEntity<User> buscarCliente(@RequestBody User userDetails) {
        // Recibo un email y una password desde el cliente, esa pass la encripto para ver si coincide con la guardada
        Optional<User> clienteOptional = clienteRepository.findByEmailAndPassword(userDetails.getEmail(), Encrypt.encryptPassword(userDetails.getContraseña()));
        if (clienteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = clienteOptional.get();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/cliente/id/{id}/update")
    public ResponseEntity<User> updateCliente(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> clienteOptional = clienteRepository.findById(id);
        if (clienteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = clienteOptional.get();
        Class<?> clienteClass = user.getClass();
        Class<?> clienteDetailsClass = userDetails.getClass();

        for (Field field : clienteClass.getDeclaredFields()) {
            field.setAccessible(true);
            String fieldName = field.getName();
            try {
                Field clienteDetailsField = clienteDetailsClass.getDeclaredField(fieldName);
                clienteDetailsField.setAccessible(true);
                Object newValue = clienteDetailsField.get(userDetails);
                if (newValue != null && !newValue.equals(field.get(user))) {
                    field.set(user, newValue);
                }
            } catch (NoSuchFieldException | IllegalAccessException e) {
                System.out.println("El error es " + e.getClass());
            }
        }
        User savedUser = clienteRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @DeleteMapping("/cliente/id/{id}/delete")
    public ResponseEntity<?> borrarCliente(@PathVariable Long id) {
        Optional<User> cliente = clienteRepository.findById(id);
        if (!cliente.isPresent()) {
            return new ResponseEntity<>("El usuario no existe o ya ha sido borrado", HttpStatus.BAD_REQUEST);
        }

        cliente.get().setBorrado("SI");

        clienteRepository.save(cliente.get());
        return new ResponseEntity<>("El usuario ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
