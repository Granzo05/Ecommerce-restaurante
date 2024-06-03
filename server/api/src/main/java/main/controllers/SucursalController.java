package main.controllers;

import jakarta.transaction.Transactional;
import main.controllers.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.Domicilio;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.Medida;
import main.entities.Productos.Imagenes;
import main.entities.Restaurante.*;
import main.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class SucursalController {
    private final SucursalRepository sucursalRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;
    private final LocalidadDeliveryRepository localidadDeliveryRepository;
    private final DomicilioRepository domicilioRepository;
    private final MedidaRepository medidaRepository;
    private final CategoriaRepository categoriaRepository;
    private final ImagenesRepository imagenesRepository;
    private final PromocionRepository promocionRepository;

    public SucursalController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, ClienteRepository clienteRepository, EmpresaRepository empresaRepository, LocalidadDeliveryRepository localidadDeliveryRepository, DomicilioRepository domicilioRepository, MedidaRepository medidaRepository, CategoriaRepository categoriaRepository, ImagenesRepository imagenesRepository, PromocionRepository promocionRepository) {
        this.sucursalRepository = sucursalRepository;
        this.empleadoRepository = empleadoRepository;
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
        this.localidadDeliveryRepository = localidadDeliveryRepository;
        this.domicilioRepository = domicilioRepository;
        this.medidaRepository = medidaRepository;
        this.categoriaRepository = categoriaRepository;
        this.imagenesRepository = imagenesRepository;
        this.promocionRepository = promocionRepository;
    }


    @CrossOrigin
    @GetMapping("/sucursal/login/{email}/{password}")
    public Sucursal loginSucursal(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        Optional<Sucursal> sucursal = sucursalRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));

        return sucursal.orElse(null);
    }

    @CrossOrigin
    @GetMapping("/sucursales/{idEmpresa}")
    public Set<Sucursal> getSucursales(@PathVariable("idEmpresa") Long idEmpresa) throws Exception {
        List<Sucursal> sucursales = sucursalRepository.findByIdEmpresa(idEmpresa);

        for (Sucursal sucursal : sucursales) {
            Domicilio domicilio = domicilioRepository.findByIdSucursal(sucursal.getId());
            sucursal.setDomicilio(domicilio);
            sucursal.setLocalidadesDisponiblesDelivery(new HashSet<>(localidadDeliveryRepository.findByIdSucursal(sucursal.getId())));
        }

        return new HashSet<>(sucursales);
    }

    @CrossOrigin
    @GetMapping("/sucursal/{idSucursal}")
    public SucursalDTO getSucursal(@PathVariable("idSucursal") Long idSucursal) throws Exception {
        Optional<SucursalDTO> sucursalDB = sucursalRepository.findByIdDTO(idSucursal);

        if(sucursalDB.isPresent()) {
            SucursalDTO sucursal = sucursalDB.get();

            sucursal.setCategorias(new HashSet<>(categoriaRepository.findAllByIdSucursal(idSucursal)));
            sucursal.setImagenes(new HashSet<>(imagenesRepository.findByIdSucursal(idSucursal)));
            sucursal.setLocalidadesDisponiblesDelivery(new HashSet<>(localidadDeliveryRepository.findByIdSucursal(idSucursal)));
            sucursal.setPromociones(new HashSet<>(promocionRepository.findAllByIdSucursal(idSucursal)));

            return sucursal;
        }

        return null;
    }

    @CrossOrigin
    @GetMapping("/localidades/delivery/sucursal/{id}")
    public Set<LocalidadDelivery> getLocalidadesDeliverySucursal(@PathVariable("id") Long id) throws Exception {
        List<LocalidadDelivery> localidades = sucursalRepository.findLocalidadesByIdSucursal(id);

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/check/{email}")
    public boolean checkPrivilegios(@PathVariable("email") String email) {
        Optional<Sucursal> sucursal = sucursalRepository.findByEmail(email);

        // Sucursal tiene acceso a todo, por lo tanto si el email coincide entonces se concede acceso
        if (sucursal != null) {
            return true;
        }

        // Recibo un email y para chequear si se puede dar acceso o no
        Optional<Cliente> cliente = clienteRepository.findByEmail(email);
        // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
        if (cliente.isPresent()) {
            return false;
        }

        Optional<Empleado> empleado = empleadoRepository.findByEmail(email);
        // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
        if (empleado.isPresent()) {
            return true;
        }

        return false;
    }

    @PostMapping("/sucursal/create")
    @Transactional
    public ResponseEntity<String> crearSucursal(@RequestBody Sucursal sucursalDetails) throws Exception {
        Optional<Sucursal> sucursalDB = sucursalRepository.findByEmail(sucursalDetails.getEmail());

        if (sucursalDB.isEmpty()) {
            Domicilio domicilio = new Domicilio();
            domicilio.setCalle(Encrypt.encriptarString(sucursalDetails.getDomicilio().getCalle()));
            domicilio.setLocalidad(sucursalDetails.getDomicilio().getLocalidad());
            domicilio.setNumero(sucursalDetails.getDomicilio().getNumero());
            domicilio.setCodigoPostal(sucursalDetails.getDomicilio().getCodigoPostal());
            domicilio.setSucursal(sucursalDetails);

            sucursalDetails.setDomicilio(domicilio);

            sucursalDetails.setContraseña(Encrypt.cifrarPassword(sucursalDetails.getContraseña()));

            sucursalDetails.setHorarioApertura(LocalTime.parse(sucursalDetails.getHorarioApertura().toString()));
            sucursalDetails.setHorarioCierre(LocalTime.parse(sucursalDetails.getHorarioCierre().toString()));
            sucursalDetails.setPrivilegios("negocio");

            Empresa empresa = empresaRepository.findById(1l).get();

            sucursalDetails.setEmpresa(empresa);
            sucursalDetails.setBorrado("NO");
            for (LocalidadDelivery localidad : sucursalDetails.getLocalidadesDisponiblesDelivery()) {
                localidad.setSucursal(sucursalDetails);
            }

            HashSet<Medida> medidas = new HashSet<>(medidaRepository.findAllByIdSucursal(1l));

            for (Medida medidaDTO : medidas) {
                Medida medida = new Medida();
                medida.setNombre(medidaDTO.getNombre());
                medida.getSucursales().add(sucursalDetails);
                medida.setBorrado("NO");

                sucursalDetails.getMedidas().add(medida);
            }

            HashSet<Categoria> categorias = new HashSet<>(categoriaRepository.findAllByIdSucursal(1l));

            for (Categoria categoriaDTO : categorias) {
                Categoria categoria = new Categoria();
                categoria.setNombre(categoriaDTO.getNombre());
                categoria.getSucursales().add(sucursalDetails);
                categoria.setBorrado("NO");

                sucursalDetails.getCategorias().add(categoria);
            }

            sucursalRepository.save(sucursalDetails);

            return ResponseEntity.ok("Carga con éxito");
        } else {
            return ResponseEntity.badRequest().body("Hay una sucursal cargada con ese email");
        }
    }

    @Transactional
    @PostMapping("/sucursal/imagenes")
    public ResponseEntity<String> crearImagenSucursal(@RequestParam("file") MultipartFile file, @RequestParam("nombreSucursal") String nombreSucursal) {
        HashSet<Imagenes> listaImagenes = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "imagesSucursal" + File.separator + nombreSucursal.replaceAll(" ", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("imagesSucursal/")
                    .path(nombreSucursal.replaceAll(" ", "") + "/")
                    .path(fileName.replaceAll(" ", ""))
                    .toUriString();

            Imagenes imagen = new Imagenes();
            imagen.setNombre(fileName.replaceAll(" ", ""));
            imagen.setRuta(downloadUrl);
            imagen.setFormato(file.getContentType());

            listaImagenes.add(imagen);

            try {
                for (Imagenes imagenProducto : listaImagenes) {
                    // Asignamos el menu a la imagen
                    Optional<Sucursal> sucursal = sucursalRepository.findByName(nombreSucursal);
                    if (sucursal.isEmpty()) {
                        return new ResponseEntity<>("sucursal vacio", HttpStatus.NOT_FOUND);
                    }
                    imagenProducto.setSucursal(sucursal.get());
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

    @Transactional
    @PutMapping("/sucursal/imagen/{id}/delete")
    public ResponseEntity<String> eliminarImagenSucursal(@PathVariable("id") Long id) {
        Optional<Imagenes> imagen = imagenesRepository.findById(id);

        if (imagen.isPresent()) {
            try {
                imagenesRepository.delete(imagen.get());
                return new ResponseEntity<>(HttpStatus.ACCEPTED);

            } catch (Exception e) {
                System.out.println("Error al crear la imagen: " + e);
            }
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Transactional
    @PutMapping("/sucursal/update")
    public ResponseEntity<String> updateSucursal(@RequestBody Sucursal sucursalDetails) throws Exception {
        Optional<Sucursal> sucursalDb = sucursalRepository.findById(sucursalDetails.getId());
        if (sucursalDb.isPresent()) {
            Optional<Sucursal> sucursalEncontrada = sucursalRepository.findByEmail(sucursalDetails.getEmail());

            // Si no es la misma sucursal pero si el mismo email entonces ejecuta esto
            if (sucursalEncontrada.isPresent() && sucursalDb.get().getId() != sucursalEncontrada.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe una sucursal con ese email");
            }

            Sucursal sucursal = sucursalDb.get();

            if (sucursal.getBorrado().equals(sucursalDetails.getBorrado())) {
                // Actualizar domicilio
                sucursal.getDomicilio().setCalle(Encrypt.encriptarString(sucursalDetails.getDomicilio().getCalle()));
                sucursal.getDomicilio().setLocalidad(sucursalDetails.getDomicilio().getLocalidad());
                sucursal.getDomicilio().setNumero(sucursalDetails.getDomicilio().getNumero());
                sucursal.getDomicilio().setSucursal(sucursalDetails);
                sucursal.getDomicilio().setCodigoPostal(sucursalDetails.getDomicilio().getCodigoPostal());

                // Actualizar contraseña
                if (sucursalDetails.getContraseña().length() > 1) {
                    sucursal.setContraseña(Encrypt.cifrarPassword(sucursalDetails.getContraseña()));
                }

                // Actualizar horarios
                sucursal.setHorarioApertura(LocalTime.parse(sucursalDetails.getHorarioApertura().toString()));
                sucursal.setHorarioCierre(LocalTime.parse(sucursalDetails.getHorarioCierre().toString()));

                // Borrar todas las localidades
                localidadDeliveryRepository.deleteAllBySucursalId(sucursal.getId());

                // Agregar nuevas localidades
                Set<LocalidadDelivery> nuevasLocalidades = new HashSet<>();
                for (LocalidadDelivery localidad : sucursalDetails.getLocalidadesDisponiblesDelivery()) {
                    localidad.setSucursal(sucursal);
                    nuevasLocalidades.add(localidad);
                }
                sucursal.setLocalidadesDisponiblesDelivery(nuevasLocalidades);

                // Actualizar otros campos
                sucursal.setEmail(sucursalDetails.getEmail());
                sucursal.setTelefono(sucursalDetails.getTelefono());

                sucursalRepository.save(sucursal);

                return ResponseEntity.ok("La sucursal se actualizó correctamente");
            } else {
                sucursal.setBorrado(sucursalDetails.getBorrado());
                sucursalRepository.save(sucursal);
                return ResponseEntity.ok("La sucursal se actualizó correctamente");
            }
        } else {
            return ResponseEntity.ok("La sucursal no se encontró");
        }
    }
}
