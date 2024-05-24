package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Subcategoria;
import main.entities.Ingredientes.SubcategoriaDTO;
import main.repositories.SubcategoriaRepository;
import main.repositories.SucursalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
public class SubcategoriaController {
    private final SubcategoriaRepository subcategoriaRepository;
    private final SucursalRepository sucursalRepository;

    public SubcategoriaController(SubcategoriaRepository subcategoriaRepository, SucursalRepository sucursalRepository) {
        this.subcategoriaRepository = subcategoriaRepository;
        this.sucursalRepository = sucursalRepository;
    }

    @GetMapping("/subcategorias/{idSucursal}")
    public Set<SubcategoriaDTO> getCategorias(@PathVariable("idSucursal") Long idSucursal) {
        return new HashSet<>(subcategoriaRepository.findAllDTOByIdSucursal(idSucursal));
    }

    @Transactional
    @PostMapping("/subcategoria/create/{idSucursal}")
    public ResponseEntity<String> crearCategoria(@RequestBody Subcategoria categoriaDetails, @PathVariable("idSucursal") Long idSucursal) {
        // Busco el subcategoria en la base de datos
        Optional<Subcategoria> subcategoriaDB = subcategoriaRepository.findByDenominacionAndIdSucursal(categoriaDetails.getNombre(), idSucursal);

        if (subcategoriaDB.isEmpty()) {
            categoriaDetails.setSucursal(sucursalRepository.findById(idSucursal).get());

            subcategoriaRepository.save(categoriaDetails);

            return new ResponseEntity<>("El subcategoria ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return ResponseEntity.ofNullable("El subcategoria ya existe");
    }

    @Transactional
    @PutMapping("/subcategoria/update/{idSucursal}")
    public ResponseEntity<String> actualizarCategoria(@RequestBody Subcategoria subcategoria, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Subcategoria> subcategoriaDB = subcategoriaRepository.findById(subcategoria.getId());

        if (subcategoriaDB.isEmpty()) {
            return ResponseEntity.ofNullable("La subcategoria no existe");
        } else {
            subcategoriaDB.get().setNombre(subcategoria.getNombre());
            subcategoriaDB.get().setBorrado(subcategoria.getBorrado());
            subcategoriaRepository.save(subcategoriaDB.get());
            return ResponseEntity.ok("Subcategoria actualizada correctamente");
        }
    }
}
