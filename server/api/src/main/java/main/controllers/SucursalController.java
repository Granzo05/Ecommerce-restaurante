package main.controllers;

import jakarta.transaction.Transactional;
import main.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.Domicilio;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Ingredientes.Medida;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;
import main.entities.Productos.Imagenes;
import main.entities.Restaurante.*;
import main.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;

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
    private final ArticuloMenuRepository articuloMenuRepository;
    private final ArticuloVentaRepository articuloVentaRepository;
    private final PrivilegiosSucursalesRepository privilegiosSucursalesRepository;
    private final RolesRepository rolesRepository;

    public SucursalController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, ClienteRepository clienteRepository, EmpresaRepository empresaRepository, LocalidadDeliveryRepository localidadDeliveryRepository, DomicilioRepository domicilioRepository, MedidaRepository medidaRepository, CategoriaRepository categoriaRepository, ImagenesRepository imagenesRepository, PromocionRepository promocionRepository, ArticuloMenuRepository articuloMenuRepository, ArticuloVentaRepository articuloVentaRepository, PrivilegiosSucursalesRepository privilegiosSucursalesRepository, RolesRepository rolesRepository) {
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
        this.articuloMenuRepository = articuloMenuRepository;
        this.articuloVentaRepository = articuloVentaRepository;
        this.privilegiosSucursalesRepository = privilegiosSucursalesRepository;
        this.rolesRepository = rolesRepository;
    }


    @CrossOrigin
    @GetMapping("/sucursal/login/{email}/{password}")
    public Sucursal loginSucursal(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        Optional<Sucursal> sucursal = sucursalRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
        return sucursal.orElse(new Sucursal());
    }

    @CrossOrigin
    @GetMapping("/clientes/{idSucursal}")
    public Set<Cliente> getClientes(@PathVariable("idSucursal") Long idSucursal) throws Exception {
        List<Cliente> clientes = clienteRepository.findBySucursal(idSucursal);

        return new HashSet<>(clientes);
    }

    @CrossOrigin
    @GetMapping("/sucursales/{idEmpresa}")
    public Set<Sucursal> getSucursalesEmpresa(@PathVariable("idEmpresa") Long idEmpresa) throws Exception {
        List<Sucursal> sucursales = sucursalRepository.findByIdEmpresa(idEmpresa);

        for (Sucursal sucursal : sucursales) {
            sucursal.setLocalidadesDisponiblesDelivery(new HashSet<>(localidadDeliveryRepository.findByIdSucursal(sucursal.getId())));
        }

        return new HashSet<>(sucursales);
    }

    @CrossOrigin
    @GetMapping("/sucursales")
    public Set<Sucursal> getSucursales() throws Exception {
        List<Sucursal> sucursales = sucursalRepository.findAll();

        for (Sucursal sucursal : sucursales) {
            sucursal.setLocalidadesDisponiblesDelivery(new HashSet<>(localidadDeliveryRepository.findByIdSucursal(sucursal.getId())));
        }

        return new HashSet<>(sucursales);
    }

    @CrossOrigin
    @GetMapping("/sucursales/provincia/{provincia}")
    public Set<Sucursal> getSucursalesPorProvincia(@PathVariable("provincia") String provincia) throws Exception {
        List<Sucursal> sucursales = sucursalRepository.findByProvincia(provincia);

        for (Sucursal sucursal : sucursales) {
            sucursal.setLocalidadesDisponiblesDelivery(new HashSet<>(localidadDeliveryRepository.findByIdSucursal(sucursal.getId())));
        }

        return new HashSet<>(sucursales);
    }

    @CrossOrigin
    @GetMapping("/sucursal/{idSucursal}")
    public Sucursal getSucursal(@PathVariable("idSucursal") Long idSucursal) throws Exception {
        Optional<Sucursal> sucursalDB = sucursalRepository.findById(idSucursal);

        if (sucursalDB.isPresent()) {
            Sucursal sucursal = sucursalDB.get();

            Set<Categoria> categorias = new HashSet<>();

            for (Categoria categoria : categoriaRepository.findAllByIdSucursalNotBorrado(idSucursal)) {
                boolean articulaVentaExistente = false;
                // Es menos trabajo buscar un articulo ya que no involucra ingredientes, por lo tanto es mejor filtrar que en caso que exista un articulo venta
                // no va a existir un menú en la misma categoría
                int cantidadArticulosDisponibles = articuloVentaRepository.findCantidadDisponiblesByIdCategoriaAndIdSucursalNotBorrado(categoria.getId(), idSucursal);

                // Si se encuentra minimo un articulo, entonces añadimos la categoria y evitamos que se busquen los menus
                if (cantidadArticulosDisponibles > 0) {
                    categorias.add(categoria);
                    articulaVentaExistente = true;
                }
                // En caso que el articulo no existe entonces si revisamos que haya por lo menos un menu mostrable con stock
                if (!articulaVentaExistente) {
                    for (ArticuloMenu menu : articuloMenuRepository.findByIdCategoriaAndIdSucursalNotBorrado(categoria.getId(), idSucursal)) {
                        // Vemos si hay stock de cada ingrediente del menu
                        int ingredientesEncontrados = 0;

                        // Vemos que exista stock de cada ingrediente necesario para el menú
                        for (IngredienteMenu ingredienteMenu : menu.getIngredientesMenu()) {
                            ingredientesEncontrados += articuloMenuRepository.findCantidadDisponiblesByIdCategoriaAndIdSucursal(categoria.getId(), ingredienteMenu.getId(), idSucursal);

                            // Si la cantidad disponible es 0 entonces no cargamos la categoria, con un ingrediente que falte ya falla
                            if (ingredientesEncontrados == 0) {
                                break;
                            }
                        }

                        // si la cantidad es igual a los ingredientes del menu entonces si cargamos esta categoria
                        if (ingredientesEncontrados == menu.getIngredientesMenu().size()) {
                            categorias.add(categoria);
                            // Rompemos el for de menu ya que con un solo menu existente ya debo mostrar la categoría
                            break;
                        }
                    }
                }

            }

            sucursal.setCategorias(categorias);

            sucursal.setImagenes(new HashSet<>(imagenesRepository.findByIdSucursal(idSucursal)));

            sucursal.setLocalidadesDisponiblesDelivery(new HashSet<>(localidadDeliveryRepository.findByIdSucursal(idSucursal)));

            sucursal.setPromociones(new HashSet<>(promocionRepository.findAllInTimeByIdSucursal(idSucursal, LocalDateTime.now())));

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

    @PostMapping("/sucursal/create")
    @CrossOrigin
    @Transactional
    public ResponseEntity<String> crearSucursal(@RequestBody Sucursal sucursalDetails) throws Exception {
        Optional<Sucursal> sucursalDB = sucursalRepository.findByEmail(sucursalDetails.getEmail());

        if (sucursalDB.isEmpty()) {
            for (Domicilio domicilio: sucursalDetails.getDomicilios()) {
                domicilio.setSucursal(sucursalDetails);
                domicilio.setBorrado("NO");
            }

            sucursalDetails.setContraseña(Encrypt.cifrarPassword(sucursalDetails.getContraseña()));

            sucursalDetails.setHorarioApertura(LocalTime.parse(sucursalDetails.getHorarioApertura().toString()));

            sucursalDetails.setHorarioCierre(LocalTime.parse(sucursalDetails.getHorarioCierre().toString()));

            sucursalDetails.setEmpresa(empresaRepository.findById(1l).get());

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

            HashSet<Categoria> categorias = new HashSet<>(categoriaRepository.findAllByIdSucursalNotBorrado(1l));

            for (Categoria categoriaDTO : categorias) {
                Categoria categoria = new Categoria();
                categoria.setNombre(categoriaDTO.getNombre());
                categoria.getSucursales().add(sucursalDetails);
                categoria.setBorrado("NO");

                sucursalDetails.getCategorias().add(categoria);
            }

            agregarPrivilegios(sucursalDetails);

            HashSet<Roles> roles = new HashSet<>(rolesRepository.findAllByIdSucursalNotBorrado(1l));

            for (Roles rolesDB : roles) {
                rolesDB.getSucursales().add(sucursalDetails);
                sucursalDetails.getRoles().add(rolesDB);
            }

            sucursalRepository.save(sucursalDetails);

            return ResponseEntity.ok("Carga con éxito");
        } else {
            return ResponseEntity.badRequest().body("Hay una sucursal cargada con ese email");
        }
    }

    @CrossOrigin
    @org.springframework.transaction.annotation.Transactional
    @PostMapping("/sucursal/imagenes")
    public ResponseEntity<String> crearImagenSucursal(@RequestParam("file") MultipartFile file, @RequestParam("nombreSucursal") String nombreSucursal) {
        HashSet<Imagenes> listaImagenes = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "imagesSucursales" + File.separator + nombreSucursal.replaceAll(" ", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("imagesSucursales/")
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
                    sucursal.get().getImagenes().add(imagenProducto);
                    imagenProducto.getSucursales().add(sucursal.get());

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

    @CrossOrigin
    @Transactional
    @PutMapping("/sucursal/imagen/{id}/delete")
    public ResponseEntity<String> eliminarImagenSucursal(@PathVariable("id") Long id) {
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
                // Crear un conjunto de domicilios en sucursalDetails para comparación
                Set<Domicilio> domiciliosDetailsSet = new HashSet<>(sucursalDetails.getDomicilios());

                // Crear una lista de domicilios para actualizar la sucursal después de la iteración
                List<Domicilio> domiciliosActualizados = new ArrayList<>();

                // Recorrer cada domicilio en la sucursal almacenada previamente
                for (Domicilio domicilio : sucursal.getDomicilios()) {
                    // Comparamos los domicilios guardados antes, si está entonces no pasa nada, si no está entonces se marca como borrado
                    if (!domiciliosDetailsSet.contains(domicilio)) {
                        domicilio.setBorrado("SI");
                    } else {
                        // Si está presente, agregarlo a la lista actualizada
                        domiciliosActualizados.add(domicilio);
                    }
                }

                // Actualizar domicilios en sucursalDetails
                for (Domicilio domicilio : sucursalDetails.getDomicilios()) {
                    domicilio.setSucursal(sucursal);
                    domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));

                    // Añadir a la lista actualizada si no está presente
                    if (!domiciliosActualizados.contains(domicilio)) {
                        domiciliosActualizados.add(domicilio);
                    }
                }

                // Reemplazar la lista de domicilios en la sucursal con la lista actualizada
                sucursal.setDomicilios(new HashSet<>(domiciliosActualizados));

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

    private void agregarPrivilegios(Sucursal sucursal) {
        PrivilegiosSucursales privilegio = new PrivilegiosSucursales();
        privilegio.setNombre("Articulos de venta");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Artículos menú");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Clientes");
        privilegio.setPermisos(Arrays.asList("READ", "DELETE", "ACTIVATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Stock");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Stock entrante");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Ingredientes");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Categorias");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Medidas");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Promociones");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Subcategorias");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Estadísticas");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Pedidos entrantes");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Pedidos aceptados");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Pedidos cocinados");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Pedidos entregados");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Pedidos en camino");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Empleados");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Sucursales");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Empresas");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);

        privilegio = new PrivilegiosSucursales();
        privilegio.getSucursales().add(sucursal);
        privilegio.setNombre("Roles");
        privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

        sucursal.getPrivilegios().add(privilegio);
    }
}
