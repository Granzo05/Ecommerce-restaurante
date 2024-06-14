package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Subcategoria;
import main.entities.Restaurante.Privilegios;
import main.repositories.PrivilegiosRepository;
import main.repositories.SubcategoriaRepository;
import main.repositories.SucursalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
public class PrivilegiosController {
    private final PrivilegiosRepository privilegiosRepository;

    public PrivilegiosController(PrivilegiosRepository privilegiosRepository) {
        this.privilegiosRepository = privilegiosRepository;
    }


    @CrossOrigin
    @GetMapping("/privilegios")
    public Set<Privilegios> getPrivilegios() {
        return new HashSet<>(privilegiosRepository.findAll());
    }


}
