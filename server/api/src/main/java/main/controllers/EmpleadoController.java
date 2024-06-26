package main.controllers;

import jakarta.transaction.Transactional;
import main.EncryptMD5.Encrypt;
import main.entities.Domicilio.Domicilio;
import main.entities.Productos.Imagenes;
import main.entities.Restaurante.*;
import main.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.time.LocalDate;
import java.util.*;

@CrossOrigin
@RestController
public class EmpleadoController {
    private final SucursalRepository sucursalRepository;
    private final EmpleadoRepository empleadoRepository;
    private final FechaContratacionRepository fechaContratacionRepository;
    private final DomicilioRepository domicilioRepository;
    private final RolesEmpleadoRepository rolesEmpleadoRepository;
    private final ImagenesRepository imagenesRepository;


    public EmpleadoController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, FechaContratacionRepository fechaContratacionRepository, DomicilioRepository domicilioRepository, RolesEmpleadoRepository rolesEmpleadoRepository, ImagenesRepository imagenesRepository) {
        this.sucursalRepository = sucursalRepository;
        this.empleadoRepository = empleadoRepository;
        this.fechaContratacionRepository = fechaContratacionRepository;
        this.domicilioRepository = domicilioRepository;
        this.rolesEmpleadoRepository = rolesEmpleadoRepository;
        this.imagenesRepository = imagenesRepository;
    }

    @CrossOrigin
    @PostMapping("/empleado/login")
    public ResponseEntity<Empleado> loginEmpleado(@RequestBody Map<String, String> credentials) throws Exception {
        String email = credentials.get("email");
        String password = credentials.get("contraseña");

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

            return ResponseEntity.ok(empleado);

        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @Transactional
    @CrossOrigin
    @PostMapping("/empleado/create/{idSucursal}")
    public ResponseEntity<String> crearEmpleado(@RequestBody Empleado empleadoDetails, @PathVariable("idSucursal") Long idSucursal) {
        try {
            // Verificar si el empleado ya existe
            Optional<Empleado> empleadoDB = empleadoRepository.findByCuilAndIdSucursal(Encrypt.encriptarString(empleadoDetails.getCuil()), idSucursal);
            if (empleadoDB.isPresent()) {
                return ResponseEntity.badRequest().body("Ya existe un empleado con ese cuil");
            }

            // Encriptar datos del empleado
            empleadoDetails.setNombre(Encrypt.encriptarString(empleadoDetails.getNombre()));
            empleadoDetails.setEmail(Encrypt.encriptarString(empleadoDetails.getEmail()));
            empleadoDetails.setContraseña(Encrypt.cifrarPassword(empleadoDetails.getContraseña()));

            // Encriptar y asignar datos de los domicilios
            for (Domicilio domicilio : empleadoDetails.getDomicilios()) {
                domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
                domicilio.setEmpleado(empleadoDetails);
            }

            // Asignar y marcar privilegios como no borrados
            for (PrivilegiosEmpleados privilegio : empleadoDetails.getPrivilegios()) {
                privilegio.getEmpleados().add(empleadoDetails);
                privilegio.setBorrado("NO");
            }


            // Asignar y marcar roles como no borrados
            for (RolesEmpleados roles : empleadoDetails.getRoles()) {
                roles.getEmpleados().add(empleadoDetails);
                roles.setBorrado("NO");
            }

            // Verificar y asignar la sucursal
            Optional<Sucursal> sucursalOpt = sucursalRepository.findById(idSucursal);
            if (!sucursalOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Sucursal no encontrada");
            }
            empleadoDetails.getSucursales().add(sucursalOpt.get());

            // Encriptar el CUIL nuevamente (después de la verificación inicial)
            empleadoDetails.setCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

            // Asignar fecha de contratación y marcar como no borrado
            FechaContratacionEmpleado fecha = new FechaContratacionEmpleado();
            fecha.setEmpleado(empleadoDetails);
            empleadoDetails.getFechaContratacion().add(fecha);
            empleadoDetails.setBorrado("NO");

            // Guardar el empleado en el repositorio
            empleadoRepository.save(empleadoDetails);

            return ResponseEntity.ok("Carga con éxito");
        } catch (Exception e) {
            // Loggear el error para depuración
            System.err.println("Error al crear el empleado: " + e.getMessage());
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

            for (RolesEmpleados rol : empleado.getRoles()) {
                if (rol.getBorrado().equals("NO")) nuevosRoles.add(rol);
            }
            empleado.setRoles(nuevosRoles);

            List<Domicilio> domicilios = domicilioRepository.findByIdEmpleadoNotBorrado(empleado.getId());

            try {
                for (Domicilio domicilio : domicilios) {
                    domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
                }
            } catch (Exception ignored) {
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

    @CrossOrigin
    @org.springframework.transaction.annotation.Transactional
    @PostMapping("/empleado/imagenes/{idSucursal}")
    public ResponseEntity<String> crearImagenEmpleado(@RequestParam("file") MultipartFile file, @RequestParam("cuilEmpleado") String cuilEmpleado, @PathVariable("idSucursal") Long idSucursal) {
        HashSet<Imagenes> listaImagenes = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "imagesEmpleados" + File.separator + cuilEmpleado.replaceAll(" ", "").replaceAll("-", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("imagesEmpleados/")
                    .path(cuilEmpleado.replaceAll(" ", "").replaceAll("-", "") + "/")
                    .path(fileName.replaceAll(" ", ""))
                    .toUriString();

            Imagenes imagen = new Imagenes();
            imagen.setNombre(fileName.replaceAll(" ", ""));
            imagen.setRuta(downloadUrl);
            imagen.setFormato(file.getContentType());

            listaImagenes.add(imagen);

            try {
                for (Imagenes imagenProducto : listaImagenes) {
                    // Asignamos el empleado a la imagen
                    Optional<Empleado> empleado = empleadoRepository.findByCuilAndIdSucursal(Encrypt.encriptarString(cuilEmpleado), idSucursal);
                    if (empleado.isEmpty()) {
                        return ResponseEntity.badRequest().body("empleado no encontrado");
                    }
                    imagenProducto.getEmpleados().add(empleado.get());
                    imagenProducto.getSucursales().add(sucursalRepository.findById(idSucursal).get());

                    imagenesRepository.save(imagenProducto);
                }

            } catch (Exception e) {
                System.out.println("Error al insertar la ruta en el menu: " + e);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>("Imagen creada correctamente", HttpStatus.OK);

        } catch (Exception e) {
            System.out.println("Error al crear la imagen: " + e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @jakarta.transaction.Transactional
    @CrossOrigin
    @PutMapping("/empleado/imagen/{id}/delete")
    public ResponseEntity<String> eliminarImagenArticulo(@PathVariable("id") Long id) {
        Optional<Imagenes> imagen = imagenesRepository.findById(id);

        if (imagen.isPresent()) {
            try {
                imagen.get().setBorrado("SI");
                imagenesRepository.save(imagen.get());
                return new ResponseEntity<>(HttpStatus.ACCEPTED);

            } catch (Exception e) {
                System.out.println("Error al crear la imagen: " + e);
            }
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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

            for (RolesEmpleados rolDB : empleadoDb.getRoles()) {
                boolean rolEncontrado = false;

                for (RolesEmpleados rolNuevo : empleadoDetails.getRoles()) {
                    if (rolDB.getRol().getNombre().equals(rolNuevo.getRol().getNombre())) {
                        // Actualizar atributos del rol existente
                        if (rolDB.getBorrado().equals("SI")) {
                            rolDB.setBorrado("NO");
                            rolesActualizados.add(rolDB);
                        } else {
                            rolDB.getEmpleados().add(empleadoDb);
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
            for (RolesEmpleados rolNuevo : empleadoDetails.getRoles()) {
                boolean esNuevo = true;
                for (RolesEmpleados rolDB : empleadoDb.getRoles()) {
                    if (rolDB.getRol().getNombre().equals(rolNuevo.getRol().getNombre())) {
                        esNuevo = false;
                        break;
                    }
                }
                if (esNuevo) {
                    rolNuevo.getEmpleados().add(empleadoDb);
                    rolNuevo.setBorrado("NO");
                    rolesActualizados.add(rolNuevo);
                }
            }

            // Actualizar la colección de roles en empleadoDb
            empleadoDb.setRoles(rolesActualizados);

            empleadoDb.getPrivilegios().clear();

            // Actualizar los privilegios con los de empleadoDetails
            for (PrivilegiosEmpleados privilegiosEmpleados : empleadoDetails.getPrivilegios()) {
                privilegiosEmpleados.getEmpleados().add(empleadoDb);
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
