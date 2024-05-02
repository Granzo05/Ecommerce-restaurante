package main.controllers;

import main.controllers.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.Domicilio;
import main.repositories.ClienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
public class ClienteController {
    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @PostMapping("/cliente/create")
    public Cliente crearCliente(@RequestBody Cliente clienteDetails) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findByEmail(clienteDetails.getEmail());
        if (cliente.isEmpty()) {
            clienteDetails.setContraseña(Encrypt.cifrarPassword(clienteDetails.getContraseña()));

            Set<Domicilio> domicilios = new HashSet<>();

            for (Domicilio domicilioCliente : clienteDetails.getDomicilios()) {
                Domicilio domicilio = Domicilio.builder()
                        .calle(Encrypt.encriptarString(domicilioCliente.getCalle()))
                        .codigoPostal(domicilioCliente.getCodigoPostal())
                        .localidad(domicilioCliente.getLocalidad())
                        .numero(domicilioCliente.getNumero())
                        .build();

                domicilios.add(domicilio);
            }
            clienteDetails.setDomicilios(domicilios);

            clienteRepository.save(clienteDetails);
            return clienteDetails;
        } else {
            return null;
        }
    }

    @CrossOrigin
    @GetMapping("/cliente/login/{email}/{password}")
    public Cliente loginUser(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        return clienteRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
    }

    @CrossOrigin
    @GetMapping("/cliente/domicilio/{email}")
    public Set<Domicilio> getDomicilio(@PathVariable("email") String email) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findByEmail(email);

        if (cliente.isEmpty()) {
            return null;
        }

        Set<Domicilio> domicilios = cliente.get().getDomicilios();

        for (Domicilio domicilio : domicilios) {
            domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
        }
        return domicilios;
    }

    @PutMapping("/cliente/update")
    public String updateCliente(@RequestBody Cliente clienteDetails) throws Exception {

        Optional<Cliente> clienteOptional = clienteRepository.findById(clienteDetails.getId());

        if (clienteOptional.isEmpty()) {
            return "Cliente inexistente";
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

        return "Cliente actualizado con éxito";
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
