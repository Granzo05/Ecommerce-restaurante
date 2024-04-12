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

    private final ImagenMenuRepository imagenMenuRepository;

    public MenuController(MenuRepository menuRepository, ImagenMenuRepository imagenMenuRepository) {
        this.menuRepository = menuRepository;
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
                    .path(fileName)
                    .toUriString();
            ResponseClass response = new ResponseClass(fileName,
                    downloadUrl,
                    file.getContentType(),
                    file.getSize());
            responseList.add(response);

            try {
                ImagenesMenu imagen = new ImagenesMenu();
                System.out.println(nombreMenu);
                // Asignamos el menu a la imagen
                Optional<Menu> menu = menuRepository.findByName(nombreMenu);
                System.out.println(menu);
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



    @PutMapping("/menu/update")
    public ResponseEntity<String> actualizarMenu(@RequestBody Menu menuDetail) {
        Optional<Menu> menuEncontrado = menuRepository.findById(menuDetail.getId());

        if (menuEncontrado.isEmpty()) {
            return new ResponseEntity<>("El menu no se encuentra", HttpStatus.NOT_FOUND);
        }

        Menu menu = menuEncontrado.get();

        menu.setPrecio(menuDetail.getPrecio());
        menu.setIngredientes(menuDetail.getIngredientes());
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
