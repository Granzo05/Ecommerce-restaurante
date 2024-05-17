package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.IngredienteDTO;
import main.repositories.IngredienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
public class IngredienteController {
    private final IngredienteRepository ingredienteRepository;

    public IngredienteController(IngredienteRepository ingredienteRepository) {
        this.ingredienteRepository = ingredienteRepository;
    }

    @GetMapping("/ingredientes")
    public Set<IngredienteDTO> getIngredientes() {
        return new HashSet<>(ingredienteRepository.findAllByNotBorrado());
    }

    @Transactional
    @PostMapping("/ingrediente/create")
    public ResponseEntity<String> crearIngrediente(@RequestBody Ingrediente ingredienteDetails) {
        // Busco el ingrediente en la base de datos
        Optional<Ingrediente> ingredienteDB = ingredienteRepository.findByName(ingredienteDetails.getNombre());

        if (ingredienteDB.isEmpty()) {
            Ingrediente ingrediente = new Ingrediente();
            ingrediente.setNombre(ingredienteDetails.getNombre());

            ingredienteRepository.save(ingrediente);

            return new ResponseEntity<>("El ingrediente ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return ResponseEntity.ofNullable("El ingrediente ya existe");
    }

    @PutMapping("/ingrediente/update")
    public ResponseEntity<String> actualizarIngrediente(@RequestBody Ingrediente ingrediente) {
        System.out.println(ingrediente);
        Optional<Ingrediente> ingredienteEncontrado = ingredienteRepository.findByIdNotBorrado(ingrediente.getId());
        System.out.println(ingredienteEncontrado);

        if (ingredienteEncontrado.isEmpty()) {
            return ResponseEntity.ofNullable("El ingrediente no existe");
        } else {
            ingredienteEncontrado.get().setNombre(ingrediente.getNombre());
            ingredienteRepository.save(ingredienteEncontrado.get());
            return ResponseEntity.ok("El ingrediente ya existe");
        }
    }

    @PutMapping("/ingrediente/{idIngrediente}/delete")
    public ResponseEntity<String> borrarIngrediente(@PathVariable("idIngrediente") Long idIngrediente) {
        Optional<Ingrediente> ingredienteEncontrado = ingredienteRepository.findByIdNotBorrado(idIngrediente);

        if (ingredienteEncontrado.isEmpty()) {
            return new ResponseEntity<>("El ingrediente ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        } else {
            ingredienteEncontrado.get().setBorrado("SI");
            ingredienteRepository.save(ingredienteEncontrado.get());
            return new ResponseEntity<>("El ingrediente ha sido borrado correctamente", HttpStatus.OK);
        }
    }
}
