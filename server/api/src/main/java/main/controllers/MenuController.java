package main.controllers;

import main.entities.Restaurante.Menu.Menu;
import main.repositories.IngredienteRepository;
import main.repositories.MenuRepository;
import main.repositories.RestauranteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
public class MenuController {
    private final MenuRepository menuRepository;

    private final RestauranteRepository restauranteRepository;
    private final IngredienteRepository ingredienteRepository;

    public MenuController(MenuRepository menuRepository,
                          RestauranteRepository restauranteRepository, IngredienteRepository ingredienteRepository) {
        this.menuRepository = menuRepository;
        this.restauranteRepository = restauranteRepository;
        this.ingredienteRepository = ingredienteRepository;
    }

    // Busca por id de menu
    @GetMapping("/menus")
    public List<Menu> getMenusPorIdRestaurante() {
        List<Menu> menus = menuRepository.findAll();

        for (Menu menu : menus) {
            // Convertimos la imagen a base64 para poder mostrarla
            menu.setImagen64(Base64.getEncoder().encodeToString(menu.getImagen()));
        }

        return menus;
    }

    @Transactional
    @PostMapping("/menu/create")
    public ResponseEntity<String> crearMenu(@RequestBody Menu menuDetails) throws IOException {

        // Todo: colocar gets para los atributos
        Menu menu = new Menu();
        menu.setNombre(menuDetails.getNombre());
        menu.setTipo(menuDetails.getTipo());
        menu.setComensales(menuDetails.getComensales());
        menu.setPrecio(menuDetails.getPrecio());
        menu.setTiempoCoccion(menuDetails.getTiempoCoccion());
        // Separo la imagen en bytes
        menu.setImagen(menuDetails.getImagen());

        menu.setRestaurante(restauranteRepository.findById(0l).get());

        menu.setIngredientes(menuDetails.getIngredientes());

        menuRepository.save(menu);
        return new ResponseEntity<>("El menu ha sido añadido correctamente", HttpStatus.ACCEPTED);

    }

    @PutMapping("/menu/update")
    public ResponseEntity<Menu> actualizarMenu(@RequestBody Menu rest) {
        Optional<Menu> menuEncontrado = menuRepository.findById(rest.getId());
        if (menuEncontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Menu menu = menuEncontrado.get();
        // Todo: settear
        Menu menuFinal = menuRepository.save(menu);
        return ResponseEntity.ok(menuFinal);
    }

    @DeleteMapping("/menu/{id}/delete")
    public ResponseEntity<?> borrarMenu(@PathVariable("id") Long id) {
        Optional<Menu> menu = menuRepository.findById(id);
        if (menu.isEmpty()) {
            return new ResponseEntity<>("El menu ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        menu.get().setBorrado("SI");
        menuRepository.save(menu.get());
        return new ResponseEntity<>("El menu ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
