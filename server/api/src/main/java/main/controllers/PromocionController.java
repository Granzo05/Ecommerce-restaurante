package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Productos.DetallePromocion;
import main.entities.Productos.Imagenes;
import main.entities.Productos.Promocion;
import main.entities.Restaurante.Sucursal;
import main.repositories.DetallePromocionRepository;
import main.repositories.ImagenesRepository;
import main.repositories.PromocionRepository;
import main.repositories.SucursalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class PromocionController {
    private final PromocionRepository promocionRepository;
    private final ImagenesRepository imagenesRepository;
    private final SucursalRepository sucursalRepository;
    private final DetallePromocionRepository detallePromocionRepository;

    public PromocionController(PromocionRepository promocionRepository, ImagenesRepository imagenesRepository, SucursalRepository sucursalRepository, DetallePromocionRepository detallePromocionRepository) {
        this.promocionRepository = promocionRepository;
        this.imagenesRepository = imagenesRepository;
        this.sucursalRepository = sucursalRepository;
        this.detallePromocionRepository = detallePromocionRepository;
    }


    @CrossOrigin
    @GetMapping("/promociones/{idSucursal}")
    public Set<Promocion> getPromociones(@PathVariable("idSucursal") Long idSucursal) throws Exception {
        List<Promocion> promociones = promocionRepository.findAllByIdSucursal(idSucursal);

        return new HashSet<>(promociones);
    }

    @PostMapping("/promocion/create/{idSucursal}")
    @CrossOrigin
    @Transactional
    public ResponseEntity<String> crearPromocion(@RequestBody Promocion promocionDetails, @PathVariable("idSucursal") Long idSucursal) throws Exception {
        Optional<Promocion> promocionDB = promocionRepository.findByNameAndIdSucursal(promocionDetails.getNombre(), idSucursal);

        if (promocionDB.isEmpty()) {
            Set<DetallePromocion> detalles = new HashSet<>();
            for (DetallePromocion detallePromocion : promocionDetails.getDetallesPromocion()) {
                if (detallePromocion.getArticuloMenu() != null) {
                    DetallePromocion detalleNuevo = new DetallePromocion();
                    detalleNuevo.setMedida(detallePromocion.getMedida());
                    detalleNuevo.setCantidad(detallePromocion.getCantidad());
                    detalleNuevo.setArticuloMenu(detallePromocion.getArticuloMenu());
                    detalleNuevo.setPromocion(promocionDetails);

                    detalles.add(detalleNuevo);
                } else if (detallePromocion.getArticuloVenta() != null) {
                    DetallePromocion detalleNuevo = new DetallePromocion();
                    detalleNuevo.setMedida(detallePromocion.getMedida());
                    detalleNuevo.setCantidad(detallePromocion.getCantidad());
                    detalleNuevo.setArticuloVenta(detallePromocion.getArticuloVenta());
                    detalleNuevo.setPromocion(promocionDetails);

                    detalles.add(detalleNuevo);
                }
            }

            promocionDetails.setDetallesPromocion(detalles);

            if (!promocionDetails.getSucursales().isEmpty()) {
                Set<Sucursal> sucursales = new HashSet<>(promocionDetails.getSucursales());
                for (Sucursal sucursalVacia : sucursales) {
                    Sucursal sucursal = sucursalRepository.findById(sucursalVacia.getId()).get();

                    promocionDetails.getSucursales().add(sucursal);

                    promocionDetails = promocionRepository.save(promocionDetails);

                    sucursal.getPromociones().add(promocionDetails);

                    sucursalRepository.save(sucursal);                }
            } else {
                Optional<Sucursal> sucursalOpt = sucursalRepository.findById(idSucursal);
                if (sucursalOpt.isPresent()) {
                    Sucursal sucursal = sucursalOpt.get();
                    if (!sucursal.getPromociones().contains(promocionDetails)) {
                        promocionDetails.getSucursales().add(sucursal);

                        promocionDetails = promocionRepository.save(promocionDetails);

                        sucursal.getPromociones().add(promocionDetails);

                        sucursalRepository.save(sucursal);
                    }
                } else {
                    return new ResponseEntity<>("Sucursal no encontrada con id: " + idSucursal, HttpStatus.NOT_FOUND);
                }
            }


            return ResponseEntity.ok("Promoción cargada con éxito");
        } else {
            return ResponseEntity.badRequest().body("Hay una promocion cargada con ese nombre");
        }
    }

    @CrossOrigin
    @Transactional
    @PostMapping("/promocion/imagenes/{idSucursal}")
    public ResponseEntity<String> crearImagenPromocion(@RequestParam("file") MultipartFile file, @RequestParam("nombrePromocion") String nombrePromocion, @PathVariable("idSucursal") Long idSucursal) {
        HashSet<Imagenes> listaImagenes = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "imagesPromocion" + File.separator + nombrePromocion.replaceAll(" ", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("imagesPromocion/")
                    .path(nombrePromocion.replaceAll(" ", "") + "/")
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
                    Optional<Promocion> promocion = promocionRepository.findByNameAndIdSucursal(nombrePromocion, idSucursal);
                    if (promocion.isEmpty()) {
                        return new ResponseEntity<>("promocion vacio", HttpStatus.NOT_FOUND);
                    }
                    imagenProducto.getPromociones().add(promocion.get());
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

    @CrossOrigin
    @Transactional
    @PutMapping("/promocion/imagen/{id}/delete")
    public ResponseEntity<String> eliminarImagenPromocion(@PathVariable("id") Long id) {
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
    @PutMapping("/promocion/update/{idSucursal}")
    public ResponseEntity<String> updatePromocion(@RequestBody Promocion promocionDetails, @PathVariable("idSucursal") Long idSucursal) throws Exception {
        Optional<Promocion> promocionDB = promocionRepository.findByIdPromocionAndIdSucursal(promocionDetails.getId(), idSucursal);

        if (promocionDB.isPresent()) {
            Optional<Promocion> promocionEncontrada = promocionRepository.findByNameAndIdSucursal(promocionDetails.getNombre(), idSucursal);

            // Si no es la misma sucursal pero si el mismo email entonces ejecuta esto
            if (promocionEncontrada.isPresent() && promocionDB.get().getId() != promocionEncontrada.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe una promocion con ese nombre");
            }

            Promocion promocion = promocionDB.get();

            if (promocion.getBorrado().equals(promocionDetails.getBorrado())) {
                // Borrar todas los articulos y menus
                detallePromocionRepository.deleteAllByPromocionId(promocion.getId());
                promocion.getDetallesPromocion().clear();

                // Actualizar horarios
                promocion.setFechaDesde(LocalDateTime.parse(promocionDetails.getFechaDesde().toString()));
                promocion.setFechaHasta(LocalDateTime.parse(promocionDetails.getFechaHasta().toString()));

                for (DetallePromocion detallePromocion : promocionDetails.getDetallesPromocion()) {
                    detallePromocion.setPromocion(promocion);
                    promocion.getDetallesPromocion().add(detallePromocion);
                }

                Set<Sucursal> nuevasSucursales = new HashSet<>();
                for (Sucursal sucursal : promocion.getSucursales()) {
                    sucursal.getPromociones().add(promocion);
                    nuevasSucursales.add(sucursal);
                }

                promocion.setSucursales(nuevasSucursales);

                promocion.setDescripcion(promocionDetails.getDescripcion());

                promocion.setPrecio(promocionDetails.getPrecio());

                promocion.setDetallesPromocion(promocionDetails.getDetallesPromocion());

                promocionRepository.save(promocion);

                return ResponseEntity.ok("La promoción se actualizó correctamente");
            } else {
                promocion.setBorrado(promocionDetails.getBorrado());
                promocionRepository.save(promocion);
                return ResponseEntity.ok("La promoción se actualizó correctamente");
            }
        } else {
            return ResponseEntity.ok("La promoción no se encontró");
        }
    }
}
