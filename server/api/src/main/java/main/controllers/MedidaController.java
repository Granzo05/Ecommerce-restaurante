package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.CategoriaDTO;
import main.repositories.CategoriaRepository;
import main.repositories.SubcategoriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class CategoriaController {
    private final CategoriaRepository categoriaRepository;
    private final SubcategoriaRepository subcategoriaRepository;

    public CategoriaController(CategoriaRepository categoriaRepository, SubcategoriaRepository subcategoriaRepository) {
        this.categoriaRepository = categoriaRepository;
        this.subcategoriaRepository = subcategoriaRepository;
    }


    @GetMapping("/categorias")
    public Set<CategoriaDTO> getCategorias() {
        List<CategoriaDTO> categorias = categoriaRepository.findAllDTO();

        for (CategoriaDTO categoriaDTO : categorias) {
            categoriaDTO.setSubcategorias(new HashSet<>(subcategoriaRepository.findByCategoriaId(categoriaDTO.getId())));
        }

        return new HashSet<>(categorias);
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
            categoriaDB.get().setSubcategorias(categoria.getSubcategorias());
            categoriaRepository.save(categoriaDB.get());
            return ResponseEntity.ok("Categoria actualizada correctamente");
        }
    }
}
