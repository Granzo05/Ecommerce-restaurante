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
    private final PrivilegiosSucursalesRepository privilegiosSucursalesRepository;
    private final RolesRepository rolesRepository;

    private final PrivilegiosEmpleadoRepository privilegiosEmpleadoRepository;

    private final RolesEmpleadoRepository rolesEmpleadoRepository;


    public EmpleadoController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, FechaContratacionRepository fechaContratacionRepository, DomicilioRepository domicilioRepository, PrivilegiosSucursalesRepository privilegiosSucursalesRepository, RolesRepository rolesRepository, PrivilegiosEmpleadoRepository privilegiosEmpleadoRepository, RolesEmpleadoRepository rolesEmpleadoRepository) {
        this.sucursalRepository = sucursalRepository;
        this.empleadoRepository = empleadoRepository;
        this.fechaContratacionRepository = fechaContratacionRepository;
        this.domicilioRepository = domicilioRepository;
        this.privilegiosSucursalesRepository = privilegiosSucursalesRepository;
        this.rolesRepository = rolesRepository;
        this.privilegiosEmpleadoRepository = privilegiosEmpleadoRepository;
        this.rolesEmpleadoRepository = rolesEmpleadoRepository;
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

            for (PrivilegiosEmpleados privilegio : empleadoDetails.getPrivilegios()) {
                privilegio.setEmpleado(empleadoDetails);
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
            } catch (NullPointerException ignored) {
            }

            Set<RolesEmpleados> nuevosRoles = new HashSet<>();

            for (RolesEmpleados rol : empleado.getRolesEmpleado()) {
                if (rol.getBorrado().equals("NO")) nuevosRoles.add(rol);
            }
            empleado.setRolesEmpleado(nuevosRoles);

            List<Domicilio> domicilios = domicilioRepository.findByIdEmpleadoNotBorrado(empleado.getId());

            try {
                for (Domicilio domicilio : domicilios) {
                    domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
                }
            } catch (Exception ignored){}


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


    @CrossOrigin
    @Transactional
    @PutMapping("/empleado/update/{idSucursal}")
    public ResponseEntity<String> updateEmpleado(@RequestBody Empleado empleadoDetails, @PathVariable("idSucursal") Long idSucursal) throws Exception {
        Optional<Empleado> empleadoOptional = empleadoRepository.findByCuilAndIdSucursal(Encrypt.encriptarString(empleadoDetails.getCuil()), idSucursal);

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


            // Iterar sobre los domicilios guardados en empleadoDb
            for (Domicilio domicilio : empleadoDetails.getDomicilios()) {
                domicilio.setEmpleado(empleadoDb);
            }

            empleadoDb.setDomicilios(new HashSet<>(empleadoDetails.getDomicilios()));

            Set<RolesEmpleados> rolesActualizados = new HashSet<>();

            for (RolesEmpleados rolDB : empleadoDb.getRolesEmpleado()) {
                boolean rolEncontrado = false;

                for (RolesEmpleados rolNuevo : empleadoDetails.getRolesEmpleado()) {
                    if (rolDB.getRol().getNombre().equals(rolNuevo.getRol().getNombre())) {
                        // Actualizar atributos del rol existente
                        if(rolDB.getBorrado().equals("SI")) {
                            rolDB.setBorrado("NO");
                            rolesActualizados.add(rolDB);
                        } else {
                            rolDB.setEmpleado(empleadoDb);
                            rolesActualizados.add(rolDB);
                            rolEncontrado = true;
                        }

                        break;
                    }
                }

                if (!rolEncontrado) {
                    // Si el rolDB no se encontró en empleadoDetails, marcar como borrado
                    rolDB.setBorrado("SI");
                    rolesActualizados.add(rolDB);
                }
            }

            // Agregar roles nuevos que no estaban en empleadoDb
            for (RolesEmpleados rolNuevo : empleadoDetails.getRolesEmpleado()) {
                boolean esNuevo = true;
                for (RolesEmpleados rolDB : empleadoDb.getRolesEmpleado()) {
                    if (rolDB.getRol().getNombre().equals(rolNuevo.getRol().getNombre())) {
                        esNuevo = false;
                        break;
                    }
                }
                if (esNuevo) {
                    rolNuevo.setEmpleado(empleadoDb);
                    rolNuevo.setBorrado("NO");
                    rolesActualizados.add(rolNuevo);
                }
            }

            // Actualizar la colección de roles en empleadoDb
            empleadoDb.setRolesEmpleado(rolesActualizados);

            empleadoDb.getPrivilegios().clear();

            // Actualizar los privilegios con los de empleadoDetails
            for (PrivilegiosEmpleados privilegiosEmpleados : empleadoDetails.getPrivilegios()) {
                privilegiosEmpleados.setEmpleado(empleadoDb);
                empleadoDb.getPrivilegios().add(privilegiosEmpleados);
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
