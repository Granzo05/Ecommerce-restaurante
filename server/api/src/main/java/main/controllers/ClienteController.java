package main.controllers;

import main.controllers.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.repositories.ClienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class ClienteController {
    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @PostMapping("/user/create")
    public ResponseEntity<String> crearCliente(@RequestBody Cliente clienteDetails) {
        System.out.println(clienteDetails);
        Optional<Cliente> cliente = clienteRepository.findByEmail(clienteDetails.getEmail());
        if (cliente.isEmpty()) {
            clienteDetails.setContraseña(Encrypt.encryptPassword(clienteDetails.getContraseña()));
            clienteRepository.save(clienteDetails);
            return new ResponseEntity<>("El usuario ha sido añadido correctamente", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("El usuario ya existe", HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @PostMapping("/user/login")
    public ResponseEntity<Cliente> loginUser(@PathVariable("email") String email, @PathVariable("password") String password) {
        // Recibo un email y una password desde el cliente, esa pass la encripto para ver si coincide con la guardada
        Optional<Cliente> clienteOptional = clienteRepository.findByEmailAndPassword(email, Encrypt.encryptPassword(password));
        if (clienteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Cliente cliente = clienteOptional.get();
        return ResponseEntity.ok(cliente);
    }

    @PutMapping("/user/update")
    public ResponseEntity<Cliente> updateCliente(@RequestBody Cliente clienteDetails) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(clienteDetails.getId());
        if (clienteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Cliente cliente = clienteOptional.get();

        // Todo: Agregar setters

        clienteRepository.save(cliente);

        return ResponseEntity.ok(cliente);
    }

    @DeleteMapping("/cliente/id/{id}/delete")
    public ResponseEntity<?> borrarCliente(@RequestBody Cliente user) {
        Optional<Cliente> cliente = clienteRepository.findById(user.getId());
        if (!cliente.isPresent()) {
            return new ResponseEntity<>("El usuario no existe o ya ha sido borrado", HttpStatus.BAD_REQUEST);
        }

        cliente.get().setBorrado("SI");

        clienteRepository.save(cliente.get());
        return new ResponseEntity<>("El usuario ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
