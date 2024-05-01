package main.controllers;

import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ImagenesProducto;
import main.repositories.ImagenMenuRepository;
import main.repositories.IngredienteMenuRepository;
import main.repositories.IngredienteRepository;
import main.repositories.MenuRepository;
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
import java.util.Optional;
import java.util.Set;

@RestController
public class MenuController {
    private final MenuRepository menuRepository;

    private final IngredienteMenuRepository ingredienteMenuRepository;
    private final IngredienteRepository ingredienteRepository;

    private final ImagenMenuRepository imagenMenuRepository;

    public MenuController(MenuRepository menuRepository, IngredienteMenuRepository ingredienteMenuRepository, IngredienteRepository ingredienteRepository, ImagenMenuRepository imagenMenuRepository) {
        this.menuRepository = menuRepository;
        this.ingredienteMenuRepository = ingredienteMenuRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.imagenMenuRepository = imagenMenuRepository;
    }

    // Busca por id de menu
    @GetMapping("/menus")
    public Set<ArticuloMenu> getMenusDisponibles() {
        return menuRepository.findAllByNotBorrado();
    }

    @Transactional
    @PostMapping("/menu/create")
    public ResponseEntity<String> crearMenu(@RequestBody ArticuloMenu articuloMenu) {
        Optional<ArticuloMenu> menuDB = menuRepository.findByName(articuloMenu.getNombre());
        System.out.println(articuloMenu);

        if (menuDB.isEmpty()) {
            ArticuloMenu articuloMenuSaved = menuRepository.save(articuloMenu);

            Set<IngredienteMenu> ingredientesMenu = articuloMenu.getIngredientesMenu();

            for (IngredienteMenu ingredienteMenu : ingredientesMenu) {
                Ingrediente ingredienteDB = ingredienteRepository.findByName(ingredienteMenu.getIngrediente().getNombre());

                ingredienteMenu.setIngrediente(ingredienteDB);
                ingredienteMenu.setCantidad(ingredienteMenu.getCantidad());
                ingredienteMenu.setArticuloMenu(articuloMenuSaved);
                ingredienteMenu.setMedida(ingredienteMenu.getMedida());
                System.out.println(ingredienteMenu);

                ingredienteMenuRepository.save(ingredienteMenu);
            }

            return new ResponseEntity<>("El menú ha sido añadido correctamente", HttpStatus.ACCEPTED);

        } else {
            return new ResponseEntity<>("Hay un menú creado con ese nombre", HttpStatus.FOUND);
        }
    }

    @PostMapping("/menu/imagenes")
    public ResponseEntity<String> handleMultipleFilesUpload(@RequestParam("file") MultipartFile file, @RequestParam("nombreMenu") String nombreMenu) {
        HashSet<ImagenesProducto> responseList = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "images" + File.separator + nombreMenu.replaceAll(" ", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/download/")
                    .path(fileName.replaceAll(" ", ""))
                    .toUriString();
            ImagenesProducto response = ImagenesProducto.builder()
                    .nombre(fileName.replaceAll(" ", ""))
                    .ruta(downloadUrl)
                    .formato(file.getContentType())
                    .peso(file.getSize())
                    .build();

            responseList.add(response);

            try {
                ImagenesProducto imagen = new ImagenesProducto();
                // Asignamos el menu a la imagen
                Optional<ArticuloMenu> menu = menuRepository.findByName(nombreMenu);
                if (menu.isEmpty()) {
                    return new ResponseEntity<>("Menu vacio", HttpStatus.NOT_FOUND);
                }
                imagen.setArticuloMenu(menu.get());

                imagenMenuRepository.save(imagen);

            } catch (Exception e) {
                System.out.println("Error al insertar la ruta en el menu: " + e);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>("Imagen creada correctamente", HttpStatus.ACCEPTED);

        } catch (Exception e) {
            System.out.println("Error al crear la imagen: " + e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/menu/tipo/{tipoMenu}")
    public HashSet<ArticuloMenu> getMenusPorTipo(@PathVariable("tipoMenu") String tipo) {
        HashSet<ArticuloMenu> articuloMenus = menuRepository.findByType(tipo);

        for (ArticuloMenu articuloMenu : articuloMenus) {
            HashSet<IngredienteMenu> ingredientes = ingredienteMenuRepository.findByMenuId(articuloMenu.getId());

            articuloMenu.setIngredientesMenu(ingredientes);

            // Obtener la ruta de la carpeta de imágenes
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "images" + File.separator + articuloMenu.getNombre().replaceAll(" ", "") + File.separator;
            // Verificar si la carpeta existe
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                // Si la carpeta no existe, pasamos al siguiente menu
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
                                    .path("/menu/imagenes/")
                                    .path(articuloMenu.getNombre().replaceAll(" ", ""))
                                    .path("/")
                                    .path(archivo.getName().replaceAll(" ", ""))
                                    .toUriString();
                            ImagenesProducto response = ImagenesProducto.builder()
                                    .nombre(archivo.getName().replaceAll(" ", ""))
                                    .ruta(downloadUrl)
                                    .formato(Files.probeContentType(archivo.toPath()))
                                    .peso(archivo.length())
                                    .build();
                            articuloMenu.getImagenes().add(response);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
        return articuloMenus;
    }

    @PutMapping("/menu/update")
    public ResponseEntity<String> actualizarMenu(@RequestBody ArticuloMenu articuloMenuDetail) {
        Optional<ArticuloMenu> menuEncontrado = menuRepository.findById(articuloMenuDetail.getId());

        if (menuEncontrado.isEmpty()) {
            return new ResponseEntity<>("El menu no se encuentra", HttpStatus.NOT_FOUND);
        }

        ArticuloMenu articuloMenu = menuEncontrado.get();

        articuloMenu.setPrecioVenta(articuloMenuDetail.getPrecioVenta());
        articuloMenu.setIngredientesMenu(articuloMenuDetail.getIngredientesMenu());
        articuloMenu.setTiempoCoccion(articuloMenuDetail.getTiempoCoccion());
        articuloMenu.setDescripcion(articuloMenuDetail.getDescripcion());
        articuloMenu.setNombre(articuloMenuDetail.getNombre());
        articuloMenu.setTipo(articuloMenuDetail.getTipo());
        articuloMenu.setComensales(articuloMenuDetail.getComensales());

        menuRepository.save(articuloMenu);

        return new ResponseEntity<>("El menu ha sido actualizado correctamente", HttpStatus.ACCEPTED);
    }

    @PutMapping("/menu/{id}/delete")
    public ResponseEntity<String> borrarMenu(@PathVariable("id") Long id) {
        Optional<ArticuloMenu> menu = menuRepository.findById(id);
        if (menu.isEmpty()) {
            return new ResponseEntity<>("El menu ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        menu.get().setBorrado("SI");
        menuRepository.save(menu.get());
        return new ResponseEntity<>("El menu ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
