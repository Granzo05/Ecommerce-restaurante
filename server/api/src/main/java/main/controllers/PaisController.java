package main.controllers;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import main.entities.Domicilio.Departamento;
import main.entities.Domicilio.Localidad;
import main.entities.Domicilio.Pais;
import main.entities.Domicilio.Provincia;
import main.repositories.DepartamentoRepository;
import main.repositories.LocalidadRepository;
import main.repositories.PaisRepository;
import main.repositories.ProvinciaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class PaisController {
    private final LocalidadRepository localidadRepository;
    private final DepartamentoRepository departamentoRepository;
    private final ProvinciaRepository provinciaRepository;
    private final PaisRepository paisRepository;



    public PaisController(LocalidadRepository localidadRepository, DepartamentoRepository departamentoRepository, ProvinciaRepository provinciaRepository, PaisRepository paisRepository) {
        this.localidadRepository = localidadRepository;
        this.departamentoRepository = departamentoRepository;
        this.provinciaRepository = provinciaRepository;
        this.paisRepository = paisRepository;
    }

    @CrossOrigin
    @GetMapping("/provincias")
    public Set<Provincia> getProvincias() {
        Set provincias = new HashSet<>(provinciaRepository.findAllDTO());

        return provincias;
    }

    @CrossOrigin
    @GetMapping("/localidades")
    public Set<Localidad> getLocalidades() {
        Set localidades = new HashSet<>(localidadRepository.findAllDTO());

        return localidades;
    }

    @CrossOrigin
    @GetMapping("/localidades/{departamentoId}")
    public Set<Localidad> getLocalidadesByDepartamentoId(@PathVariable("departamentoId") Long id) {
        Set localidades = new HashSet<>(localidadRepository.findByIdDepartamento(id));

        return localidades;
    }

    @CrossOrigin
    @GetMapping("/departamentos/{provinciaId}")
    public Set<Departamento> getDepartamentosByDepartamentoId(@PathVariable("provinciaId") Long id) {
        Set departamentos = new HashSet<>(departamentoRepository.findByProvinciaId(id));

        return departamentos;
    }

}
