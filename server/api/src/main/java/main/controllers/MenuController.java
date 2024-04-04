package main.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import main.entities.Restaurante.Menu.Ingrediente;
import main.entities.Restaurante.Menu.IngredienteMenu;
import main.entities.Restaurante.Menu.Menu;
import main.repositories.IngredienteMenuRepository;
import main.repositories.IngredienteRepository;
import main.repositories.MenuRepository;
import main.repositories.RestauranteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
public class MenuController {
    private final MenuRepository menuRepository;

    private final RestauranteRepository restauranteRepository;
    private final IngredienteMenuRepository ingredienteMenuRepository;
    private final IngredienteRepository ingredienteRepository;

    public MenuController(MenuRepository menuRepository,
                          RestauranteRepository restauranteRepository, IngredienteMenuRepository ingredienteMenuRepository, IngredienteRepository ingredienteRepository) {
        this.menuRepository = menuRepository;
        this.restauranteRepository = restauranteRepository;
        this.ingredienteMenuRepository = ingredienteMenuRepository;
        this.ingredienteRepository = ingredienteRepository;
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

        menu.setBorrado("NO");

        menuRepository.save(menu);
        return new ResponseEntity<>("El menú ha sido añadido correctamente", HttpStatus.ACCEPTED);
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
