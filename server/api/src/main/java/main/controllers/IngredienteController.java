package main.controllers;

import main.entities.Ingredientes.Ingrediente;
import main.repositories.IngredienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class IngredienteController {
    private final IngredienteRepository ingredienteRepository;

    public IngredienteController(IngredienteRepository ingredienteRepository) {
        this.ingredienteRepository = ingredienteRepository;
    }

    @GetMapping("/ingredientes")
    public List<Ingrediente> getIngredientes() {
        return ingredienteRepository.findAll();
    }

    @PutMapping("/ingrediente/update")
    public ResponseEntity<String> actualizarIngrediente(@RequestBody Ingrediente ingrediente) {
        Ingrediente ingredienteEncontrado = ingredienteRepository.findByName(ingrediente.getNombre());

        if (ingredienteEncontrado == null) {
            return new ResponseEntity<>("El ingrediente no existe", HttpStatus.NOT_FOUND);
        }

        ingredienteRepository.save(ingredienteEncontrado);

        return new ResponseEntity<>("Ingrediente actualizado correctamente", HttpStatus.BAD_REQUEST);
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
