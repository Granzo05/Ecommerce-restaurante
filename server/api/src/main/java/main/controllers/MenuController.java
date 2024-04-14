package main.controllers;

import main.entities.Restaurante.Menu.*;
import main.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    public List<Menu> getMenusDisponibles() {
        return menuRepository.findAllByNotBorrado();
    }

    @Transactional
    @PostMapping("/menu/create")
    public ResponseEntity<String> crearMenu(@RequestBody Menu menu) {
        Optional<Menu> menuDB = menuRepository.findByName(menu.getNombre());

        if (menuDB.isEmpty()) {
            // Seteamos que no está borrado
            menu.setBorrado("NO");
            Menu menuSaved = menuRepository.save(menu);

            List<IngredienteMenu> ingredientesMenu = menu.getIngredientesMenu();

            for (int i = 0; i < ingredientesMenu.size(); i++) {
                IngredienteMenu ingredienteMenu = ingredientesMenu.get(i);

                Ingrediente ingredienteDB = ingredienteRepository.findByName(ingredienteMenu.getIngrediente().getNombre());

                ingredienteMenu.setIngrediente(ingredienteDB);
                ingredienteMenu.setCantidad(ingredienteMenu.getCantidad());
                ingredienteMenu.setMenu(menuSaved);
                ingredienteMenu.setMedida(ingredienteMenu.getIngrediente().getMedida());
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
        List<ResponseClass> responseList = new ArrayList<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "assets" + File.separator + nombreMenu.replaceAll(" ", "") + File.separator;

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
            ResponseClass response = new ResponseClass(fileName.replaceAll(" ", ""),
                    downloadUrl,
                    file.getContentType(),
                    file.getSize());
            responseList.add(response);

            try {
                ImagenesMenu imagen = new ImagenesMenu();
                // Asignamos el menu a la imagen
                Optional<Menu> menu = menuRepository.findByName(nombreMenu);
                if (menu.isEmpty()) {
                    return new ResponseEntity<>("Menu vacio", HttpStatus.NOT_FOUND);
                }
                imagen.setMenu(menu.get());
                // Asignamos la ruta
                imagen.setRuta(rutaArchivo);

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
    public List<Menu> getMenusPorTipo(@PathVariable("tipoMenu") String tipo) {
        List<Menu> menus = menuRepository.findByType(tipo);

        for(Menu menu: menus) {
            List<IngredienteMenu> ingredientes = ingredienteMenuRepository.findByMenuId(menu.getId());

            menu.setIngredientesMenu(ingredientes);

            // Obtener la ruta de la carpeta de imágenes
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "images" + File.separator + menu.getNombre().replaceAll(" ", "") + File.separator;
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
                                    .path(menu.getNombre().replaceAll(" ", ""))
                                    .path("/")
                                    .path(archivo.getName().replaceAll(" ", ""))
                                    .toUriString();
                            ResponseClass response = new ResponseClass(archivo.getName().replaceAll(" ", ""),
                                    downloadUrl,
                                    Files.probeContentType(archivo.toPath()),
                                    archivo.length());
                            menu.addImagen(response);
                        } catch (IOException e) {
                            // Manejar errores de IO
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
        // Devolver la lista de menus
        return menus;
    }

    @PutMapping("/menu/update")
    public ResponseEntity<String> actualizarMenu(@RequestBody Menu menuDetail) {
        Optional<Menu> menuEncontrado = menuRepository.findById(menuDetail.getId());

        if (menuEncontrado.isEmpty()) {
            return new ResponseEntity<>("El menu no se encuentra", HttpStatus.NOT_FOUND);
        }

        Menu menu = menuEncontrado.get();

        menu.setPrecio(menuDetail.getPrecio());
        menu.setIngredientesMenu(menuDetail.getIngredientesMenu());
        menu.setTiempoCoccion(menuDetail.getTiempoCoccion());
        menu.setDescripcion(menuDetail.getDescripcion());
        menu.setNombre(menuDetail.getNombre());
        menu.setTipo(menuDetail.getTipo());
        menu.setComensales(menuDetail.getComensales());

        menuRepository.save(menu);
        return new ResponseEntity<>("El menu ha sido actualizado correctamente", HttpStatus.ACCEPTED);
    }

    @PutMapping("/menu/{id}/delete")
    public ResponseEntity<String> borrarMenu(@PathVariable("id") Long id) {
        Optional<Menu> menu = menuRepository.findById(id);
        if (menu.isEmpty()) {
            return new ResponseEntity<>("El menu ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        menu.get().setBorrado("SI");
        menuRepository.save(menu.get());
        return new ResponseEntity<>("El menu ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
