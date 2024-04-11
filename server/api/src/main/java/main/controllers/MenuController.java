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
        System.out.println(menu);
        Optional<Menu> menuDB = menuRepository.findByName(menu.getNombre());
        // Buscamos si hay un menu creado, en caso de encontrarlo se envía el error
        if (menuDB.isEmpty()) {
            menu.setBorrado("NO");
            menuRepository.save(menu);
            return new ResponseEntity<>("El menú ha sido añadido correctamente", HttpStatus.ACCEPTED);

        } else {
            return new ResponseEntity<>("Hay un menu creado con ese nombre", HttpStatus.FOUND);
        }
    }

    @PostMapping("/menu/imagenes")
    public ResponseEntity<String> handleMultipleFilesUpload(@RequestParam("file") MultipartFile file, @RequestParam("nombreMenu") String nombreMenu) {

        List<ResponseClass> responseList = new ArrayList<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename();
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaArchivo = basePath + File.separator + "src" + File.separator + "assets" + File.separator + nombreMenu + File.separator + fileName;
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

            ImagenesMenu imagen = new ImagenesMenu();
            // Asignamos el menu a la imagen
            Optional<Menu> menu = menuRepository.findByName(nombreMenu);

            if (menu.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            imagen.setMenu(menu.get());
            // Asignamos la ruta
            imagen.setRuta(rutaArchivo);

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
