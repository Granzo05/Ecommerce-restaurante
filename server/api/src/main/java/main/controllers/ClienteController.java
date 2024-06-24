package main.controllers;

import jakarta.transaction.Transactional;
import main.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.Domicilio;
import main.repositories.ClienteRepository;
import main.repositories.DomicilioRepository;
import main.repositories.LocalidadRepository;
import main.repositories.SucursalRepository;
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
    private final SucursalRepository sucursalRepository;

    public ClienteController(ClienteRepository clienteRepository, DomicilioRepository domicilioRepository, LocalidadRepository localidadRepository, SucursalRepository sucursalRepository) {
        this.clienteRepository = clienteRepository;
        this.domicilioRepository = domicilioRepository;
        this.sucursalRepository = sucursalRepository;
    }

    @Transactional
    @CrossOrigin
    @PostMapping("/cliente/create")
    public Cliente crearCliente(@RequestBody Cliente clienteDetails) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findByEmail(clienteDetails.getEmail());

        if (cliente.isEmpty()) {
            clienteDetails.setContraseña(Encrypt.cifrarPassword(clienteDetails.getContraseña()));
            for (Domicilio domicilio : clienteDetails.getDomicilios()) {
                domicilio.setLocalidad(domicilio.getLocalidad());
                domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
                domicilio.setCliente(clienteDetails);
                domicilio.setBorrado("NO");

                // Buscamos si hay un restaurante en la localidad del cliente para enviarlo a esa sucursal en el main
                if (domicilio.getBorrado() == "NO")
                    clienteDetails.setIdSucursalRecomendada(buscarRestauranteCercano(domicilio));
            }

            clienteDetails.setBorrado("NO");
            clienteDetails = clienteRepository.save(clienteDetails);


            return clienteDetails;
        } else {
            return new Cliente();
        }
    }

    private Long buscarRestauranteCercano(Domicilio domicilio) {
        List<Long> idSucursales = sucursalRepository.findIdByIdLocalidadDomicilio(domicilio.getLocalidad().getId());

        if (!idSucursales.isEmpty()) {
            return idSucursales.get(0);
        } else {
            // Si no encontramos localidad, entonces por departamento
            List<Long> idSucursal = sucursalRepository.findIdByIdDepartamentoDomicilio(domicilio.getLocalidad().getDepartamento().getId());
            if (!idSucursal.isEmpty()) {
                return idSucursal.get(0);
            } else {
                // finalmente por provincia
                idSucursal = sucursalRepository.findIdByIdProvinciaDomicilio(domicilio.getLocalidad().getDepartamento().getProvincia().getId());
                if (!idSucursal.isEmpty()) {
                    return idSucursal.get(0);
                } else {
                    // En este caso se le avisa al cliente que no hay ningun restaurante en su provincia
                    return 0l;
                }
            }
        }

    }

    @CrossOrigin
    @GetMapping("/cliente/login/{email}/{password}")
    public Cliente loginUser(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
        if (cliente.isPresent()) {
            // Buscamos la sucursal más cercana a los domicilios existentes del usuario
            for (Domicilio domicilio : cliente.get().getDomicilios()) {
                if (domicilio.getBorrado() == "NO")
                    cliente.get().setIdSucursalRecomendada(buscarRestauranteCercano(domicilio));
            }

            return cliente.get();

        } else return new Cliente();
    }

    @CrossOrigin
    @GetMapping("/cliente/email/{email}")
    public Cliente getUser(@PathVariable("email") String email) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findByEmail(email);

        if (cliente.isPresent()) {
            // Buscamos la sucursal más cercana a los domicilios existentes del usuario
            for (Domicilio domicilio : cliente.get().getDomicilios()) {
                if (domicilio.getBorrado() == "NO")
                    cliente.get().setIdSucursalRecomendada(buscarRestauranteCercano(domicilio));
            }

            return cliente.get();

        } else return new Cliente();
    }

    @CrossOrigin
    @GetMapping("/cliente/{idCliente}/domicilios")
    public Set<Domicilio> getDomicilio(@PathVariable("idCliente") Long idCliente) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findById(idCliente);

        if (cliente.isEmpty()) {
            return null;
        }

        List<Domicilio> domicilios = domicilioRepository.findByIdClienteNotBorrado(cliente.get().getId());

        for (Domicilio domicilio : domicilios) {
            domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
        }

        return new HashSet<>(domicilios);
    }

    @CrossOrigin
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

        cliente.setBorrado(clienteDetails.getBorrado());

        clienteRepository.save(cliente);

        return ResponseEntity.ok("Cuenta actualizada con éxito");
    }

    @CrossOrigin
    @PutMapping("/cliente/{id}/delete")
    public ResponseEntity<String> borrarCliente(@RequestBody Cliente user) {
        Optional<Cliente> cliente = clienteRepository.findById(user.getId());
        if (!cliente.isPresent()) {
            return new ResponseEntity<>("El usuario no existe o ya ha sido borrado", HttpStatus.BAD_REQUEST);
        }

        cliente.get().setBorrado("SI");

        clienteRepository.save(cliente.get());

        return new ResponseEntity<>("El usuario ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
