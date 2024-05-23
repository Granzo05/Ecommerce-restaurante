package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Subcategoria;
import main.entities.Ingredientes.CategoriaDTO;
import main.entities.Ingredientes.SubcategoriaDTO;
import main.repositories.CategoriaRepository;
import main.repositories.SubcategoriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
public class SubcategoriaController {
    private final SubcategoriaRepository subcategoriaRepository;

    public SubcategoriaController(SubcategoriaRepository subcategoriaRepository) {
        this.subcategoriaRepository = subcategoriaRepository;
    }

    @GetMapping("/subcategorias")
    public Set<SubcategoriaDTO> getCategorias() {
        return new HashSet<>(subcategoriaRepository.findAllDTO());
    }

    @Transactional
    @PostMapping("/subcategoria/create")
    public ResponseEntity<String> crearCategoria(@RequestBody Subcategoria categoriaDetails) {
        // Busco el subcategoria en la base de datos
        Optional<Subcategoria> subcategoriaDB = subcategoriaRepository.findByName(categoriaDetails.getDenominacion());

        if (subcategoriaDB.isEmpty()) {
            subcategoriaRepository.save(categoriaDetails);

            return new ResponseEntity<>("El subcategoria ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return ResponseEntity.ofNullable("El subcategoria ya existe");
    }

    @Transactional
    @PutMapping("/subcategoria/update")
    public ResponseEntity<String> actualizarCategoria(@RequestBody Subcategoria subcategoria) {
        Optional<Subcategoria> subcategoriaDB = subcategoriaRepository.findById(subcategoria.getId());

        if (subcategoriaDB.isEmpty()) {
            return ResponseEntity.ofNullable("La subcategoria no existe");
        } else {
            subcategoriaDB.get().setDenominacion(subcategoria.getDenominacion());
            subcategoriaDB.get().setBorrado(subcategoria.getBorrado());
            subcategoriaRepository.save(subcategoriaDB.get());
            return ResponseEntity.ok("Subcategoria actualizada correctamente");
        }
    }
}
