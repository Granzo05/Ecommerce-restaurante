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

    @GetMapping("/ingredientes/{idSucursal}")
    public Set<IngredienteDTO> getIngredientes(@PathVariable("idSucursal") Long idSucursal) {
        return new HashSet<>(ingredienteRepository.findAllByIdSucursal(idSucursal));
    }

    @Transactional
    @PostMapping("/ingrediente/create/{idSucursal}")
    public ResponseEntity<String> crearIngrediente(@RequestBody Ingrediente ingredienteDetails, @PathVariable("idSucursal") Long idSucursal) {
        // Busco el ingrediente en la base de datos
        Optional<Ingrediente> ingredienteDB = ingredienteRepository.findByNameAndIdSucursal(ingredienteDetails.getNombre(), idSucursal);

        if (ingredienteDB.isEmpty()) {
            Ingrediente ingrediente = new Ingrediente();
            ingrediente.setNombre(ingredienteDetails.getNombre());

            ingredienteRepository.save(ingrediente);

            return new ResponseEntity<>("El ingrediente ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return ResponseEntity.ofNullable("El ingrediente ya existe");
    }

    @PutMapping("/ingrediente/update/{idSucursal}")
    public ResponseEntity<String> actualizarIngrediente(@RequestBody Ingrediente ingrediente, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Ingrediente> ingredienteEncontrado = ingredienteRepository.findByIdIngredienteAndIdSucursal(ingrediente.getId(), idSucursal);
        if (ingredienteEncontrado.isEmpty()) {
            return ResponseEntity.ofNullable("El ingrediente no existe");
        } else {
            Optional<Ingrediente> ingredienteDB = ingredienteRepository.findByNameAndIdSucursal(ingrediente.getNombre(), idSucursal);

            if (ingredienteDB.isPresent() && ingredienteDB.get().getId() != ingredienteEncontrado.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe un ingrediente con ese nombre");
            }

            ingredienteEncontrado.get().setNombre(ingrediente.getNombre());

            ingredienteEncontrado.get().setBorrado(ingrediente.getBorrado());

            ingredienteRepository.save(ingredienteEncontrado.get());

            return ResponseEntity.ok("El ingrediente ya existe");
        }
    }
}
