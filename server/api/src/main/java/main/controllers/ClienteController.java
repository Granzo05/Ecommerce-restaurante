package main.controllers;

import jakarta.transaction.Transactional;
import main.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.Domicilio;
import main.repositories.ClienteRepository;
import main.repositories.DomicilioRepository;
import main.repositories.LocalidadRepository;
import main.repositories.SucursalRepository;
import main.utility.Gmail;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.*;

@CrossOrigin
@RestController
public class ClienteController {
    private static final String EMAIL_RESPALDO = "contactodelbuensabor@gmail.com";
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
    @PostMapping("/cliente/login")
    public ResponseEntity<Cliente> loginUser(@RequestBody Map<String, String> credentials) throws Exception {
        String email = credentials.get("email");
        String password = credentials.get("contraseña");


        Optional<Cliente> cliente = clienteRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
        if (cliente.isPresent()) {
            // Buscamos la sucursal más cercana a los domicilios existentes del usuario
            for (Domicilio domicilio : cliente.get().getDomicilios()) {
                if (domicilio.getBorrado() == "NO")
                    cliente.get().setIdSucursalRecomendada(buscarRestauranteCercano(domicilio));
            }

            return ResponseEntity.ok(cliente.get());

        } else return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    }

    @CrossOrigin
    @GetMapping("/cliente/check/{id}/{password}")
    public boolean checkPassword(@PathVariable("id") Long id, @PathVariable("password") String password) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findByIdAndPassword(id, Encrypt.cifrarPassword(password));
        if (cliente.isPresent()) {
            return true;
        } else return false;
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
    @GetMapping("/cliente/id/{id}")
    public Cliente getUserById(@PathVariable("id") Long id) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findById(id);

        if (cliente.isPresent()) {
            for (Domicilio domicilio : cliente.get().getDomicilios()) {
                domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
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

        List<Domicilio> domicilios = domicilioRepository.findByIdCliente(cliente.get().getId());

        for (Domicilio domicilio : domicilios) {
            domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
        }

        return new HashSet<>(domicilios);
    }

    @CrossOrigin
    @GetMapping("/cliente/{idCliente}/domicilios/disponibles")
    public Set<Domicilio> getDomiciliosDisponibles(@PathVariable("idCliente") Long idCliente) throws Exception {
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
        cliente.getDomicilios().clear();

        for (Domicilio domicilio : clienteDetails.getDomicilios()) {
            domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
            domicilio.setCliente(cliente);

            cliente.getDomicilios().add(domicilio);
        }

        if (cliente.getTelefono() != clienteDetails.getTelefono() && clienteDetails.getTelefono() > 120000) {
            cliente.setTelefono(clienteDetails.getTelefono());
        }

        if (cliente.getEmail() != clienteDetails.getEmail() && clienteDetails.getEmail() != null) {
            cliente.setEmail(clienteDetails.getEmail());
        }

        if (cliente.getNombre() != clienteDetails.getNombre() && clienteDetails.getNombre() != null) {
            cliente.setNombre(clienteDetails.getNombre());
        }

        if (clienteDetails.getContraseña().length() > 6 && !Encrypt.cifrarPassword(clienteDetails.getContraseña()).equals(cliente.getContraseña()) && clienteDetails.getContraseña() != null) {
            cliente.setContraseña(Encrypt.cifrarPassword(clienteDetails.getContraseña()));
        }

        cliente.setBorrado(clienteDetails.getBorrado());

        clienteRepository.save(cliente);

        return ResponseEntity.ok("Cuenta actualizada con éxito");
    }

    @CrossOrigin
    @PutMapping("/cliente/recoverpassword")
    public ResponseEntity<String> reiniciarContraseña(@RequestBody String email) throws GeneralSecurityException, IOException, MessagingException {
        Optional<Cliente> cliente = clienteRepository.findByEmail(email);

        if (cliente.isEmpty()) {
            return ResponseEntity.badRequest().body("No existe ningun usuario con ese email");
        }

        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(index));
        }

        cliente.get().setContraseña(Encrypt.cifrarPassword(String.valueOf(password)));

        String mensaje = "Tu contraseña ha sido cambiada, para ingresar nuevamente a tu cuenta usa la siguiente generada aleatoriamente. Una vez que ingreses puedes modificarla a tu gusto: \n " + password;

        Gmail gmail = new Gmail();

        gmail.enviarCorreo("Cambio de contraseña de tu cuenta del buen sabor", mensaje, email, EMAIL_RESPALDO);

        clienteRepository.save(cliente.get());

        return ResponseEntity.ok().body("La contraseña ha sido actualizada correctamente. revisa tu correo para usarla");
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
