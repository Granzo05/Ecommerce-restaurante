package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.CategoriaDTO;
import main.repositories.CategoriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
public class CategoriaController {
    private final CategoriaRepository categoriaRepository;

    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }


    @GetMapping("/categorias")
    public Set<CategoriaDTO> getCategorias() {
        return new HashSet<>(categoriaRepository.findAllDTO());
    }

    @Transactional
    @PostMapping("/categoria/create")
    public ResponseEntity<String> crearCategoria(@RequestBody Categoria categoriaDetails) {
        // Busco el categoria en la base de datos
        Optional<Categoria> categoriaDB = categoriaRepository.findByName(categoriaDetails.getDenominacion());

        if (categoriaDB.isEmpty()) {
            categoriaRepository.save(categoriaDetails);

            return new ResponseEntity<>("El categoria ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return ResponseEntity.ofNullable("El categoria ya existe");
    }

    @Transactional
    @PutMapping("/categoria/update")
    public ResponseEntity<String> actualizarCategoria(@RequestBody Categoria categoria) {
        Optional<Categoria> categoriaDB = categoriaRepository.findById(categoria.getId());

        if (categoriaDB.isEmpty()) {
            return ResponseEntity.ofNullable("La categoria no existe");
        } else {
            categoriaDB.get().setDenominacion(categoria.getDenominacion());
            categoriaDB.get().setBorrado(categoria.getBorrado());
            categoriaDB.get().setSubcategoria(categoria.getSubcategoria());
            categoriaRepository.save(categoriaDB.get());
            return ResponseEntity.ok("Categoria actualizada correctamente");
        }
    }
}
