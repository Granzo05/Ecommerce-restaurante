package main.controllers;

import jakarta.transaction.Transactional;
import main.EncryptMD5.Encrypt;
import main.entities.Domicilio.Domicilio;
import main.entities.Restaurante.*;
import main.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
public class EmpleadoController {
    private final SucursalRepository sucursalRepository;
    private final EmpleadoRepository empleadoRepository;
    private final FechaContratacionRepository fechaContratacionRepository;
    private final DomicilioRepository domicilioRepository;
    private final PrivilegiosRepository privilegiosRepository;

    public EmpleadoController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, FechaContratacionRepository fechaContratacionRepository, DomicilioRepository domicilioRepository, PrivilegiosRepository privilegiosRepository) {
        this.sucursalRepository = sucursalRepository;
        this.empleadoRepository = empleadoRepository;
        this.fechaContratacionRepository = fechaContratacionRepository;
        this.domicilioRepository = domicilioRepository;
        this.privilegiosRepository = privilegiosRepository;
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

            Set<Sucursal> sucursal = new HashSet<>();

            for (Sucursal sucursales : empleadoDb.get().getSucursales()) {
                sucursal.clear();
                sucursal.add(sucursales);
            }

            empleado.setSucursales(sucursal);

            return empleadoDb.get();

        }

        return new Empleado();
    }

    @Transactional
    @CrossOrigin
    @PostMapping("/empleado/create/{idSucursal}")
    public ResponseEntity<String> crearEmpleado(@RequestBody Empleado empleadoDetails, @PathVariable("idSucursal") Long idSucursal) {
        try {
            Optional<Empleado> empleadoDB = empleadoRepository.findByCuilAndIdSucursal(Encrypt.encriptarString(empleadoDetails.getCuil()), idSucursal);

            if (empleadoDB.isPresent()) {
                return ResponseEntity.badRequest().body("Ya existe un empleado con ese cuil");
            }

            empleadoDetails.setNombre(Encrypt.encriptarString(empleadoDetails.getNombre()));
            empleadoDetails.setEmail(Encrypt.encriptarString(empleadoDetails.getEmail()));
            empleadoDetails.setContraseña(Encrypt.cifrarPassword(empleadoDetails.getContraseña()));

            for (Domicilio domicilio : empleadoDetails.getDomicilios()) {
                domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
                domicilio.setEmpleado(empleadoDetails);
            }

            for (PrivilegiosEmpleados privilegio : empleadoDetails.getEmpleadoPrivilegios()) {
                privilegio.setEmpleado(empleadoDetails);
                Optional<Privilegios> privilegioDB = privilegiosRepository.findByNombreAndIdSucursal(privilegio.getPrivilegio().getNombre(), idSucursal);
                if (privilegioDB.isPresent()) {
                    privilegio.setPrivilegio(privilegioDB.get());
                } else {
                    throw new Exception("Privilegio no encontrado");
                }
            }

            for (RolesEmpleados roles : empleadoDetails.getRolesEmpleado()) {
                roles.setEmpleado(empleadoDetails);
            }

            Optional<Sucursal> sucursalOpt = sucursalRepository.findById(idSucursal);
            if (sucursalOpt.isPresent()) {
                empleadoDetails.getSucursales().add(sucursalOpt.get());
            } else {
                throw new Exception("Sucursal no encontrada");
            }

            empleadoDetails.setCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

            FechaContratacionEmpleado fecha = new FechaContratacionEmpleado();
            fecha.setEmpleado(empleadoDetails);
            empleadoDetails.getFechaContratacion().add(fecha);
            empleadoDetails.setBorrado("NO");

            empleadoRepository.save(empleadoDetails);

            return ResponseEntity.ok("Carga con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el empleado: " + e.getMessage());
        }
    }

    @CrossOrigin
    @GetMapping("/empleados/{idSucursal}")
    public Set<Empleado> getEmpleados(@PathVariable("idSucursal") Long idSucursal) throws Exception {

        List<Empleado> empleados = empleadoRepository.findAllByIdSucursal(idSucursal);

        for (Empleado empleado : empleados) {
            try {
                empleado.setNombre(Encrypt.desencriptarString(empleado.getNombre()));
                empleado.setEmail(Encrypt.desencriptarString(empleado.getEmail()));
                empleado.setCuil(Encrypt.desencriptarString(empleado.getCuil()));
            } catch (NullPointerException ignored) {}


            List<Domicilio> domicilios = domicilioRepository.findByIdEmpleado(empleado.getId());

            for (Domicilio domicilio : domicilios) {
                domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
            }

            empleado.setDomicilios(new HashSet<>(domicilios));

            empleado.setFechaContratacion(new HashSet<>(fechaContratacionRepository.findByIdEmpleado(empleado.getId())));
        }

        return new HashSet<>(empleados);
    }

    @CrossOrigin
    @GetMapping("/cocineros/{idSucursal}")
    public int getCantidadCocineros(@PathVariable("idSucursal") Long idSucursal) {
        return empleadoRepository.findCantidadCocineros(idSucursal);
    }


    @Transactional
    @CrossOrigin
    @PutMapping("/empleado/update/{idSucursal}")
    public ResponseEntity<String> updateEmpleado(@RequestBody Empleado empleadoDetails, @PathVariable("idSucursal") Long idSucursal) throws Exception {
        Optional<Empleado> empleadoOptional = empleadoRepository.findByCuilAndIdSucursal(empleadoDetails.getCuil(), idSucursal);

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

            // Si el empleado no contiene la sucursal entonces quiere decir que se le asignó una nueva
            if (!empleadoDb.getSucursales().contains(empleadoDetails.getSucursales().stream().toList().get(0))) {
                for (Sucursal sucursal : empleadoDb.getSucursales()) {
                    sucursal.setBorrado("SI");
                }

                Sucursal nuevaSucursal = sucursalRepository.findById(idSucursal).get();
                nuevaSucursal.getEmpleados().add(empleadoDb);
                empleadoDb.getSucursales().add(nuevaSucursal);
            }

            empleadoDb.setCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

            Set<Domicilio> domiciliosDetailsSet = new HashSet<>(empleadoDetails.getDomicilios());

            // Crear una lista de domicilios para actualizar la sucursal después de la iteración
            List<Domicilio> domiciliosActualizados = new ArrayList<>();

            // Recorrer cada domicilio en la sucursal almacenada previamente
            for (Domicilio domicilio : empleadoDb.getDomicilios()) {
                // Comparamos los domicilios guardados antes, si está entonces no pasa nada, si no está entonces se marca como borrado
                if (!domiciliosDetailsSet.contains(domicilio)) {
                    domicilio.setBorrado("SI");
                } else {
                    // Si está presente, agregarlo a la lista actualizada
                    domiciliosActualizados.add(domicilio);
                }
            }

            // Actualizar domicilios en sucursalDetails
            for (Domicilio domicilio : empleadoDetails.getDomicilios()) {
                domicilio.setEmpleado(empleadoDb);
                domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));

                // Añadir a la lista actualizada si no está presente
                if (!domiciliosActualizados.contains(domicilio)) {
                    domiciliosActualizados.add(domicilio);
                }
            }

            // Reemplazar la lista de domicilios en la sucursal con la lista actualizada
            empleadoDb.setDomicilios(new HashSet<>(domiciliosActualizados));

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
