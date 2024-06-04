package main.controllers;

import jakarta.transaction.Transactional;
import main.controllers.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.Domicilio;
import main.repositories.ClienteRepository;
import main.repositories.DomicilioRepository;
import main.repositories.LocalidadRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class ClienteController {
    private final ClienteRepository clienteRepository;
    private final DomicilioRepository domicilioRepository;
    private final LocalidadRepository localidadRepository;

    public ClienteController(ClienteRepository clienteRepository, DomicilioRepository domicilioRepository, LocalidadRepository localidadRepository) {
        this.clienteRepository = clienteRepository;
        this.domicilioRepository = domicilioRepository;
        this.localidadRepository = localidadRepository;
    }

    @Transactional
    @PostMapping("/cliente/create")
    public Cliente crearCliente(@RequestBody Cliente clienteDetails) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findByEmail(clienteDetails.getEmail());

        if (cliente.isEmpty()) {
            clienteDetails.setContraseña(Encrypt.cifrarPassword(clienteDetails.getContraseña()));
            for (Domicilio domicilio : clienteDetails.getDomicilios()) {
                domicilio.setLocalidad(localidadRepository.findByName(domicilio.getLocalidad().getNombre()).get());
                domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
                domicilio.setCliente(clienteDetails);
            }

            clienteDetails = clienteRepository.save(clienteDetails);

            Cliente Cliente = new Cliente();

            Cliente.setId(clienteDetails.getId());
            Cliente.setNombre(clienteDetails.getNombre());
            Cliente.setTelefono(clienteDetails.getTelefono());
            Cliente.setEmail(clienteDetails.getEmail());

            return Cliente;
        } else {
            return null;
        }
    }

    @CrossOrigin
    @GetMapping("/cliente/login/{email}/{password}")
    public Cliente loginUser(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));

        if (cliente.isPresent()) {
            return cliente.get();
        } else return null;
    }

    @CrossOrigin
    @GetMapping("/cliente/{idCliente}/domicilios")
    public Set<Domicilio> getDomicilio(@PathVariable("idCliente") Long idCliente) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findById(idCliente);

        if (cliente.isEmpty()) {
            return null;
        }

        List<Domicilio> domicilios = domicilioRepository.findByIdCliente(cliente.get().getId());

        for (Domicilio domicilio : domicilios) {
            domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
        }

        return new HashSet<>(domicilios);
    }

    @PutMapping("/cliente/update")
    public ResponseEntity<String> updateCliente(@RequestBody Cliente clienteDetails) throws Exception {
        Optional<Cliente> clienteOptional = clienteRepository.findById(clienteDetails.getId());

        Optional<Cliente> clienteDB = clienteRepository.findByEmail(clienteDetails.getEmail());

        if (clienteDB.isPresent() && clienteDB.get().getId() != clienteOptional.get().getId()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe una cuenta registrada con ese email");
        }

        Cliente cliente = clienteOptional.get();

        for (Domicilio domicilio : clienteDetails.getDomicilios()) {
            if (cliente.getDomicilios().stream().anyMatch(d ->
            {
                try {
                    return Encrypt.encriptarString(d.getCalle()).equals(domicilio.getCalle());
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            })) {
                cliente.setDomicilios(clienteDetails.getDomicilios());
            }
        }


        if (cliente.getTelefono() != clienteDetails.getTelefono() && clienteDetails.getTelefono() > 120000) {
            cliente.setTelefono(clienteDetails.getTelefono());
        }

        if (cliente.getEmail() != clienteDetails.getEmail() && clienteDetails.getEmail() != null) {
            cliente.setEmail(clienteDetails.getEmail());
        }

        if (Encrypt.cifrarPassword(clienteDetails.getContraseña()).equals(cliente.getContraseña()) && clienteDetails.getContraseña() != null) {
            cliente.setContraseña(Encrypt.cifrarPassword(clienteDetails.getContraseña()));
        }

        clienteRepository.save(cliente);

        return ResponseEntity.ok("Cuenta actualizada con éxito");
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
