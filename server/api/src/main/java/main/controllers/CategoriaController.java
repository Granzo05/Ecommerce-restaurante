package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.CategoriaDTO;
import main.repositories.CategoriaRepository;
import main.repositories.SubcategoriaRepository;
import main.repositories.SucursalRepository;
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
    private final SucursalRepository sucursalRepository;

    public CategoriaController(CategoriaRepository categoriaRepository, SubcategoriaRepository subcategoriaRepository, SucursalRepository sucursalRepository) {
        this.categoriaRepository = categoriaRepository;
        this.subcategoriaRepository = subcategoriaRepository;
        this.sucursalRepository = sucursalRepository;
    }


    @GetMapping("/categorias/{idSucursal}")
    public Set<CategoriaDTO> getCategorias(@PathVariable("idSucursal") Long idSucursal) {
        List<CategoriaDTO> categorias = categoriaRepository.findAllDTOByIdSucursal(idSucursal);

        for (CategoriaDTO categoriaDTO : categorias) {
            categoriaDTO.setSubcategorias(new HashSet<>(subcategoriaRepository.findAllDTOByIdCategoria(categoriaDTO.getId())));
        }

        return new HashSet<>(categorias);
    }

    @Transactional
    @PostMapping("/categoria/create/{idSucursal}")
    public ResponseEntity<String> crearCategoria(@RequestBody Categoria categoriaDetails, @PathVariable("idSucursal") Long idSucursal) {
        // Busco el categoria en la base de datos
        Optional<Categoria> categoriaDB = categoriaRepository.findByDenominacionAndIdSucursal(categoriaDetails.getDenominacion(), idSucursal);

        if (categoriaDB.isEmpty()) {
            categoriaDetails.getSucursales().add(sucursalRepository.findById(idSucursal).get());

            categoriaRepository.save(categoriaDetails);

            return new ResponseEntity<>("El categoria ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return ResponseEntity.ofNullable("El categoria ya existe");
    }

    @Transactional
    @PutMapping("/categoria/update/{idSucursal}")
    public ResponseEntity<String> actualizarCategoria(@RequestBody Categoria categoria, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Categoria> categoriaDB = categoriaRepository.findByIdCategoriaAndIdSucursal(categoria.getId(), idSucursal);

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
