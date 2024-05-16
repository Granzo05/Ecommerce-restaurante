package main.controllers;

import main.entities.Productos.ArticuloVenta;
import main.entities.Productos.EnumTipoArticuloComida;
import main.entities.Productos.ImagenesProducto;
import main.repositories.ArticuloVentaRepository;
import main.repositories.ImagenesProductoRepository;
import main.repositories.IngredienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class ArticuloVentaController {
    private final IngredienteRepository ingredienteRepository;

    private final ImagenesProductoRepository imagenesProductoRepository;
    private final ArticuloVentaRepository articuloVentaRepository;

    public ArticuloVentaController(IngredienteRepository ingredienteRepository, ImagenesProductoRepository imagenesProductoRepository, ArticuloVentaRepository articuloVentaRepository) {
        this.ingredienteRepository = ingredienteRepository;
        this.imagenesProductoRepository = imagenesProductoRepository;
        this.articuloVentaRepository = articuloVentaRepository;
    }

    // Busca por id de articulo
    @GetMapping("/articulos")
    public Set<ArticuloVenta> getArticulosDisponibles() {
        List<ArticuloVenta> articulos = articuloVentaRepository.findAllByNotBorrado();
        System.out.println(articulos);
        for (ArticuloVenta articulo : articulos) {
            articulo.setImagenesDTO(new HashSet<>(imagenesProductoRepository.findByIdArticulo(articulo.getId())));
        }

        return new HashSet<>(articulos);
    }

    @Transactional
    @PostMapping("/articulo/create")
    public ResponseEntity<String> crearArticulo(@RequestBody ArticuloVenta articuloVenta) {
        Optional<ArticuloVenta> articuloDB = articuloVentaRepository.findByName(articuloVenta.getNombre());
        if (articuloDB.isEmpty()) {
            articuloVentaRepository.save(articuloVenta);
            return new ResponseEntity<>("El menú ha sido añadido correctamente", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Hay un menú creado con ese nombre", HttpStatus.FOUND);
        }
    }

    @PostMapping("/articulo/imagenes")
    public ResponseEntity<String> crearImagen(@RequestParam("file") MultipartFile file, @RequestParam("nombreArticulo") String nombreArticulo) {
        HashSet<ImagenesProducto> listaImagenes = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "images" + File.separator + nombreArticulo.replaceAll(" ", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path(nombreArticulo.replaceAll(" ", "") + "/")
                    .path(fileName.replaceAll(" ", ""))
                    .toUriString();

            ImagenesProducto imagen = new ImagenesProducto();
            imagen.setNombre(fileName.replaceAll(" ", ""));
            imagen.setRuta(downloadUrl);
            imagen.setFormato(file.getContentType());

            listaImagenes.add(imagen);

            try {
                for (ImagenesProducto imagenProducto : listaImagenes) {
                    // Asignamos el articulo a la imagen
                    Optional<ArticuloVenta> articulo = articuloVentaRepository.findByName(nombreArticulo);
                    if (articulo.isEmpty()) {
                        return new ResponseEntity<>("Articulo vacio", HttpStatus.NOT_FOUND);
                    }
                    imagenProducto.setArticuloVenta(articulo.get());

                    imagenesProductoRepository.save(imagen);
                }

            } catch (Exception e) {
                System.out.println("Error al insertar la ruta en el articulo: " + e);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>("Imagen creada correctamente", HttpStatus.OK);

        } catch (Exception e) {
            System.out.println("Error al crear la imagen: " + e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/articulo/imagen/{id}/delete")
    public ResponseEntity<String> eliminarImagen(@PathVariable("id") Long id) {
        Optional<ImagenesProducto> imagen = imagenesProductoRepository.findById(id);

        if (imagen.isPresent()) {
            try {
                imagen.get().setBorrado("SI");
                imagenesProductoRepository.save(imagen.get());
                return new ResponseEntity<>("Imagen creada correctamente", HttpStatus.OK);
            } catch (Exception e) {
                System.out.println("Error al crear la imagen: " + e);
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/articulo/tipo/{tipoArticulo}")
    public Set<ArticuloVenta> getArticulosPorTipo(@PathVariable("tipoArticulo") String tipo) {
        String tipoArticulo = tipo.toUpperCase().replace(" ", "_");
        Set<ArticuloVenta> articuloVentas = (new HashSet<>(articuloVentaRepository.findByType(EnumTipoArticuloComida.valueOf(tipoArticulo))));

        for (ArticuloVenta articuloVenta : articuloVentas) {
            // Obtener la ruta de la carpeta de imágenes
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "images" + File.separator + articuloVenta.getNombre().replaceAll(" ", "") + File.separator;
            // Verificar si la carpeta existe
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                // Si la carpeta no existe, pasamos al siguiente articulo
                continue;
            }

            // Obtener todos los archivos en la carpeta
            File[] archivos = carpeta.listFiles();

            // Recorrer los archivos y agregarlos a la lista de respuestas
            if (archivos != null) {
                for (File archivo : archivos) {
                    if (archivo.isFile()) {
                        try {
                            // Construir la URL de descarga
                            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                                    .path("/articulo/imagenes/")
                                    .path(articuloVenta.getNombre().replaceAll(" ", ""))
                                    .path("/")
                                    .path(archivo.getName().replaceAll(" ", ""))
                                    .toUriString();
                            ImagenesProducto response = ImagenesProducto.builder()
                                    .nombre(archivo.getName().replaceAll(" ", ""))
                                    .ruta(downloadUrl)
                                    .formato(Files.probeContentType(archivo.toPath()))
                                    .build();
                            articuloVenta.getImagenes().add(response);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
        return articuloVentas;
    }

    @PutMapping("/articulo/update")
    public ResponseEntity<String> actualizarArticulo(@RequestBody ArticuloVenta articuloVentaDetail) {
        Optional<ArticuloVenta> articuloEncontrado = articuloVentaRepository.findById(articuloVentaDetail.getId());

        if (articuloEncontrado.isEmpty()) {
            return new ResponseEntity<>("El articulo no se encuentra", HttpStatus.NOT_FOUND);
        }

        ArticuloVenta articuloVenta = articuloEncontrado.get();

        articuloVenta.setPrecioVenta(articuloVentaDetail.getPrecioVenta());
        articuloVenta.setNombre(articuloVentaDetail.getNombre());
        articuloVenta.setTipo(articuloVentaDetail.getTipo());
        articuloVenta.setMedida(articuloVentaDetail.getMedida());

        articuloVentaRepository.save(articuloVenta);

        return new ResponseEntity<>("El articulo ha sido actualizado correctamente", HttpStatus.ACCEPTED);
    }

    @PutMapping("/articulo/{id}/delete")
    public ResponseEntity<String> borrarArticulo(@PathVariable("id") Long id) {
        Optional<ArticuloVenta> articulo = articuloVentaRepository.findById(id);
        if (articulo.isEmpty()) {
            return new ResponseEntity<>("El articulo ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        articulo.get().setBorrado("SI");
        articuloVentaRepository.save(articulo.get());
        return new ResponseEntity<>("El articulo ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
