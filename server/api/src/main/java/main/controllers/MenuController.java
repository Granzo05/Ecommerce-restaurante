package main.controllers;

import main.entities.Restaurante.Menu.EnumTipoMenu;
import main.entities.Restaurante.Menu.IngredienteMenu;
import main.entities.Restaurante.Menu.Menu;
import main.repositories.MenuRepository;
import main.repositories.RestauranteRepository;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
public class MenuController {
    private final MenuRepository menuRepository;
    private final RestauranteRepository restauranteRepository;

    public MenuController(MenuRepository menuRepository,
                          RestauranteRepository restauranteRepository) {
        this.menuRepository = menuRepository;
        this.restauranteRepository = restauranteRepository;
    }

    // Busca por id de menu
    @GetMapping("/menus")
    public List<Menu> getMenusPorIdRestaurante() {
        List<Menu> menus = menuRepository.findAll();

        for (Menu menu: menus) {
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
        menu.setNombre(nombre);
        menu.setTipo(tipo);
        menu.setComensales(comensales);
        menu.setPrecio(precio);
        menu.setTiempoCoccion(tiempo);
        // Separo la imagen en bytes
        menu.setImagen(file.getBytes());
        menu.setRestaurante(restauranteRepository.findById(restauranteId).get());

        List<IngredienteMenu> ingredientes = new ArrayList<>();
        try {
            JSONArray ingredientesJSON = new JSONArray(ingredientesInputs);
            for (int i = 0; i < ingredientesJSON.length(); i++) {
                JSONObject ingredienteJSON = ingredientesJSON.getJSONObject(i);
                IngredienteMenu ingrediente = new IngredienteMenu();
                ingrediente.setNombre(ingredienteJSON.getString("nombre"));
                ingrediente.setCantidad(ingredienteJSON.getInt("cantidad"));
                ingredientes.add(ingrediente);
            }
        } catch (JSONException) {
        return new ResponseEntity<>("El menu no fue añadido", HttpStatus.ACCEPTED);

        }
        menu.setIngredientes(ingredientes);

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
