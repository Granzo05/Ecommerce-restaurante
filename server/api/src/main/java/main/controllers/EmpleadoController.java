package main.controllers;

import jakarta.transaction.Transactional;
import main.controllers.EncryptMD5.Encrypt;
import main.entities.Domicilio.Domicilio;
import main.entities.Restaurante.Empleado;
import main.entities.Restaurante.FechaContratacionEmpleado;
import main.repositories.DomicilioRepository;
import main.repositories.EmpleadoRepository;
import main.repositories.FechaContratacionRepository;
import main.repositories.SucursalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class EmpleadoController {
    private final SucursalRepository sucursalRepository;
    private final EmpleadoRepository empleadoRepository;
    private final FechaContratacionRepository fechaContratacionRepository;
    private final DomicilioRepository domicilioRepository;

    public EmpleadoController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, FechaContratacionRepository fechaContratacionRepository, DomicilioRepository domicilioRepository) {
        this.sucursalRepository = sucursalRepository;
        this.empleadoRepository = empleadoRepository;
        this.fechaContratacionRepository = fechaContratacionRepository;
        this.domicilioRepository = domicilioRepository;
    }


    @CrossOrigin
    @GetMapping("/empleado/login/{email}/{password}")
    public Empleado loginEmpleado(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        Optional<Empleado> empleadoDb = empleadoRepository.findByEmailAndPassword(Encrypt.encriptarString(email), Encrypt.cifrarPassword(password));

        if (empleadoDb.isPresent()) {
            Empleado empleado = empleadoDb.get();

            empleado.setNombre(Encrypt.desencriptarString(empleado.getNombre()));
            empleado.setEmail(Encrypt.desencriptarString(empleado.getEmail()));
            empleado.setCuil(Encrypt.desencriptarString(empleado.getCuil()));
        }

        return empleadoDb.get();
    }

    @Transactional
    @PostMapping("/empleado/create")
    public ResponseEntity<String> crearEmpleado(@RequestBody Empleado empleadoDetails) throws Exception {
        Optional<Empleado> empleadoDB = empleadoRepository.findByCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

        if (empleadoDB.isEmpty()) {
            empleadoDetails.setNombre(Encrypt.encriptarString(empleadoDetails.getNombre()));

            empleadoDetails.setEmail(Encrypt.encriptarString(empleadoDetails.getEmail()));

            empleadoDetails.setContraseña(Encrypt.cifrarPassword(empleadoDetails.getContraseña()));

            for (Domicilio domicilio : empleadoDetails.getDomicilios()) {
                domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
                domicilio.setEmpleado(empleadoDetails);
            }

            empleadoDetails.setSucursal(sucursalRepository.findById(empleadoDetails.getSucursal().getId()).get());
            empleadoDetails.setCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

            FechaContratacionEmpleado fecha = new FechaContratacionEmpleado();
            fecha.setEmpleado(empleadoDetails);
            empleadoDetails.getFechaContratacion().add(fecha);
            empleadoDetails.setBorrado("NO");

            empleadoRepository.save(empleadoDetails);

            return ResponseEntity.ok("Carga con exito");
        } else {
            return ResponseEntity.badRequest().body("Ya existe un empleado con ese cuil");
        }
    }

    @GetMapping("/empleados/{idSucursal}")
    public Set<Empleado> getEmpleados(@PathVariable("idSucursal") Long idSucursal) throws Exception {

        List<Empleado> empleados = empleadoRepository.findAllByIdSucursal(idSucursal);

        for (Empleado empleado : empleados) {
            empleado.setNombre(Encrypt.desencriptarString(empleado.getNombre()));
            empleado.setEmail(Encrypt.desencriptarString(empleado.getEmail()));
            empleado.setCuil(Encrypt.desencriptarString(empleado.getCuil()));

            List<Domicilio> domicilios = domicilioRepository.findByIdEmpleado(empleado.getId());

            for (Domicilio domicilio : domicilios) {
                domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
            }

            empleado.setDomicilios(new HashSet<>(domicilios));

            empleado.setFechaContratacion(new HashSet<>(fechaContratacionRepository.findByIdEmpleado(empleado.getId())));
        }

        return new HashSet<>(empleados);
    }


    @Transactional
    @PutMapping("/empleado/update")
    public ResponseEntity<String> updateEmpleado(@RequestBody Empleado empleadoDetails) throws Exception {
        Optional<Empleado> empleadoOptional = empleadoRepository.findById(empleadoDetails.getId());

        if (empleadoOptional.isPresent() && empleadoOptional.get().getBorrado().equals(empleadoDetails.getBorrado())) {
            // Comparo cada uno de los datos a ver si ha cambiado, ya que clienteDetails viene de un DTO y no contiene los mismos datos del empleadoDB entonces hay valores nulos
            Empleado empleadoDb = empleadoOptional.get();

            String contraseña = empleadoDetails.getContraseña();
            if (contraseña != null && !contraseña.isEmpty()) {
                empleadoDb.setContraseña(Encrypt.cifrarPassword(contraseña));
            }

            String nombre = empleadoDetails.getNombre();
            empleadoDb.setNombre(Encrypt.encriptarString(nombre));


            Long telefono = empleadoDetails.getTelefono();
            empleadoDb.setTelefono(telefono);


            String email = empleadoDetails.getEmail();
            empleadoDb.setEmail(Encrypt.encriptarString(email));


            LocalDate fechaNacimiento = empleadoDetails.getFechaNacimiento();
            empleadoDb.setFechaNacimiento(fechaNacimiento);

            empleadoDb.setSucursal(sucursalRepository.findById(empleadoDetails.getSucursal().getId()).get());

            empleadoDb.setCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

            domicilioRepository.deleteAllByEmpleadoId(empleadoDb.getId());
            empleadoDetails.getDomicilios().size();
            for (Domicilio domicilio : empleadoDetails.getDomicilios()) {
                domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
                domicilio.setEmpleado(empleadoDetails);
                empleadoDb.getDomicilios().add(domicilio);
            }

            empleadoRepository.save(empleadoDb);

            return ResponseEntity.ok("El empleado se modificó correctamente");
        } else if (empleadoOptional.isPresent() && !empleadoOptional.get().getBorrado().equals(empleadoDetails.getBorrado())) {
            empleadoOptional.get().setBorrado(empleadoDetails.getBorrado());

            empleadoRepository.save(empleadoOptional.get());

            return ResponseEntity.ok("El empleado se modificó correctamente");
        }

        return ResponseEntity.ok("El empleado no se encontró");

    }
}
