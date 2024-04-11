package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Restaurante.Menu.Ingrediente;
import main.entities.Restaurante.Menu.IngredienteMenu;
import main.entities.Restaurante.Menu.Menu;
import main.repositories.IngredienteRepository;
import main.repositories.RestauranteRepository;
import main.repositories.IngredienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class IngredienteController {
    private final RestauranteRepository restauranteRepository;
    private final IngredienteRepository ingredienteRepository;

    public IngredienteController(RestauranteRepository restauranteRepository,
                                 IngredienteRepository ingredienteRepository) {
        this.restauranteRepository = restauranteRepository;
        this.ingredienteRepository = ingredienteRepository;
    }

    @GetMapping("/ingredientes")
    public List<Ingrediente> getIngredientes() {
        List<Ingrediente> ingredientes = ingredienteRepository.findAll();
        if (ingredientes.isEmpty()) {
            return null;
        }

        return ingredientes;
    }
    @PutMapping("/ingrediente/update")
    public ResponseEntity<Ingrediente> actualizarIngrediente(@RequestBody Ingrediente ingrediente) {
        Ingrediente ingredienteEncontrado = ingredienteRepository.findByName(ingrediente.getNombre());
        if (ingredienteEncontrado == null) {
            return ResponseEntity.notFound().build();
        }
        Ingrediente ingredienteFinal = ingredienteRepository.save(ingredienteEncontrado);
        return ResponseEntity.ok(ingredienteFinal);
    }

    @DeleteMapping("ingrediente/delete")
    public ResponseEntity<?> borrarIngrediente(@RequestBody Ingrediente ingrediente) {
        Ingrediente ingredienteEncontrado = ingredienteRepository.findByName(ingrediente.getNombre());
        if (ingredienteEncontrado == null) {
            return new ResponseEntity<>("El ingrediente ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        ingredienteEncontrado.setBorrado("SI");
        ingredienteRepository.save(ingredienteEncontrado);
        return new ResponseEntity<>("El ingrediente ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
