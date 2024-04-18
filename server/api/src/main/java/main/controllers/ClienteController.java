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

    @PostMapping("/cliente/create")
    public Cliente crearCliente(@RequestBody Cliente clienteDetails) {
        Optional<Cliente> cliente = clienteRepository.findByEmail(clienteDetails.getEmail());
        if (cliente.isEmpty()) {
            clienteDetails.setContraseña(Encrypt.encryptPassword(clienteDetails.getContraseña()));
            clienteDetails.setBorrado("NO");
            clienteRepository.save(clienteDetails);
            return clienteDetails;
        } else {
            return null;
        }
    }

    @CrossOrigin
    @GetMapping("/cliente/login/{email}/{password}")
    public Cliente loginUser(@PathVariable("email") String email, @PathVariable("password") String password) {
        // Recibo un email y una password desde el cliente, esa pass la encripto para ver si coincide con la guardada
        Cliente cliente = clienteRepository.findByEmailAndPassword(email, Encrypt.encryptPassword(password));

        return cliente;
    }

    @CrossOrigin
    @GetMapping("/cliente/domicilio/{email}")
    public String getDomicilio(@PathVariable("email") String email) {
        // Recibo un email y una password desde el cliente, esa pass la encripto para ver si coincide con la guardada
        Optional<Cliente> cliente = clienteRepository.findByEmail(email);

        if (cliente.isEmpty()) {
            return null;
        }

        return cliente.get().getDomicilio();
    }

    @PutMapping("/cliente/update")
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

    @DeleteMapping("/cliente/{id}/delete")
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
