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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class MenuController {
    private final MenuRepository menuRepository;

    private final RestauranteRepository restauranteRepository;
    private final IngredienteMenuRepository ingredienteMenuRepository;
    private final IngredienteRepository ingredienteRepository;
    private final ImagenMenuRepository imagenMenuRepository;

    public MenuController(MenuRepository menuRepository,
                          RestauranteRepository restauranteRepository, IngredienteMenuRepository ingredienteMenuRepository, IngredienteRepository ingredienteRepository, ImagenMenuRepository imagenMenuRepository) {
        this.menuRepository = menuRepository;
        this.restauranteRepository = restauranteRepository;
        this.ingredienteMenuRepository = ingredienteMenuRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.imagenMenuRepository = imagenMenuRepository;
    }

    // Busca por id de menu
    @GetMapping("/menus")
    public List<Menu> getMenusPorIdRestaurante() {
        return menuRepository.findAllByNotBorrado();
    }

    @Transactional
    @PostMapping("/menu/create")
    public ResponseEntity<String> crearMenu(@RequestBody Menu menu) {
        for (IngredienteMenu ingredienteMenu : menu.getIngredientes()) {
            try {
                Ingrediente ingr = ingredienteRepository.findByName(ingredienteMenu.getIngrediente().getNombre());
                if (ingr == null) {
                    ingr = new Ingrediente();
                    ingr.setNombre(ingredienteMenu.getIngrediente().getNombre());
                    ingredienteRepository.save(ingr);
                }

                ingredienteMenu.setIngrediente(ingr);
                // Guarda cada instancia de IngredienteMenu antes de continuar
                ingredienteMenuRepository.save(ingredienteMenu);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        menu.setBorrado("NO ");

        menuRepository.save(menu);
        return new ResponseEntity<>("El menú ha sido añadido correctamente", HttpStatus.ACCEPTED);
    }

    /*
    @Transactional
    @PostMapping("/menu/imagenes")
    public ResponseEntity<String> crearMenu(@RequestBody List<ImagenesMenuDTO> imagenes) {
        for (ImagenesMenuDTO imagen: imagenes) {
            try {
                // Obtener los bytes del archivo
                byte[] archivoBytes = imagen.getArchivo().getBytes();

                // Crear una instancia de ImagenesMenu y establecer los valores
                ImagenesMenu imagenFinal = new ImagenesMenu();
                imagenFinal.setNombre(imagen.getArchivo().getOriginalFilename());
                imagenFinal.setArchivo(archivoBytes);

                imagenMenuRepository.save(imagenFinal);
            } catch (IOException e) {
                System.err.println("Error al cargar la imagen: " + e.getMessage());
                continue;
            }
        }
        // Devolver una respuesta de éxito si todas las imágenes se procesaron correctamente
        return ResponseEntity.ok("Imágenes cargadas exitosamente");
    }

     */

    @PostMapping("/menu/imagenes")
    public ResponseEntity<String> handleMultipleFilesUpload(@RequestParam("file") MultipartFile file) {
        System.out.println(file);
        List<ResponseClass> responseList = new ArrayList<>();
        String fileName = file.getOriginalFilename();
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaArchivo = basePath + File.separator + "src" + File.separator + "assets" + File.separator + fileName;
            System.out.println(rutaArchivo);
            file.transferTo(new File(rutaArchivo));
            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/download/")
                    .path(fileName)
                    .toUriString();
            ResponseClass response = new ResponseClass(fileName,
                    downloadUrl,
                    file.getContentType(),
                    file.getSize());
            responseList.add(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok("Imágenes cargadas exitosamente");
    }


    @PutMapping("/menu/update")
    public ResponseEntity<String> actualizarMenu(@RequestBody Menu rest) {
        Optional<Menu> menuEncontrado = menuRepository.findById(rest.getId());
        if (menuEncontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Menu menu = menuEncontrado.get();
        // Todo: settear
        Menu menuFinal = menuRepository.save(menu);
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
