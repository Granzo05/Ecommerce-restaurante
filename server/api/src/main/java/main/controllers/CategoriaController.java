package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.CategoriaDTO;
import main.entities.Ingredientes.Subcategoria;
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
        Optional<Categoria> categoriaDB = categoriaRepository.findByNameAndIdSucursal(categoriaDetails.getNombre(), idSucursal);

        if (categoriaDB.isEmpty()) {
            categoriaDetails.getSucursales().add(sucursalRepository.findById(idSucursal).get());

            categoriaRepository.save(categoriaDetails);

            return new ResponseEntity<>("El categoria ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return ResponseEntity.badRequest().body("Hay una categoria existente con ese nombre");
    }

    @PutMapping("/categoria/update/{idSucursal}")
    public ResponseEntity<String> actualizarCategoria(@RequestBody Categoria categoria, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Categoria> categoriaDB = categoriaRepository.findByIdCategoriaAndIdSucursal(categoria.getId(), idSucursal);

        if (categoriaDB.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La categoria no existe");
        } else {
            Optional<Categoria> categoriaEncontrada = categoriaRepository.findByNameAndIdSucursal(categoria.getNombre(), idSucursal);

            if (categoriaEncontrada.isPresent() && categoriaEncontrada.get().getId() != categoriaDB.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe una categoría con ese nombre");
            }

            categoriaDB.get().setNombre(categoria.getNombre());

            categoriaDB.get().setBorrado(categoria.getBorrado());

            // Creación de subcategorias
            for (Subcategoria subcategoria : categoria.getSubcategorias()) {
                subcategoriaRepository.deleteById(subcategoria.getId());
                subcategoria.setCategoria(categoriaDB.get());
                subcategoria.getSucursales().add(sucursalRepository.findById(idSucursal).get());
            }

            categoriaDB.get().setSubcategorias(categoria.getSubcategorias());

            categoriaRepository.save(categoriaDB.get());
            return ResponseEntity.ok("Categoria actualizada correctamente");
        }
    }
}
