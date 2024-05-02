package main.controllers;

import main.entities.Domicilio.Departamento;
import main.entities.Domicilio.Localidad;
import main.entities.Domicilio.Pais;
import main.entities.Domicilio.Provincia;
import main.repositories.DepartamentoRepository;
import main.repositories.LocalidadRepository;
import main.repositories.PaisRepository;
import main.repositories.ProvinciaRepository;
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

    @PostMapping("/localidades/create")
    public void cargarLocalidades() {
        String csvFile = "D://Buen-sabor//buen-sabor-app-typescript-react//server//api//src//main//resources//localidades.csv";
        String cvsSplitBy = ";";

        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {

            Pais pais = obtenerPais("Argentina");

            String line;

            while ((line = br.readLine()) != null) {
                String[] data = line.split(cvsSplitBy);
                String provinciaNombre = data[2];

                Provincia provincia = obtenerProvincia(provinciaNombre, pais);

                String departamentoNombre = data[1];
                Departamento departamento = obtenerDepartamento(departamentoNombre, provincia);

                String localidadNombre = data[0];
                crearLocalidad(localidadNombre, departamento);
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Pais obtenerPais(String nombre) {
        Optional<Pais> paisDb = paisRepository.findByNombre(nombre);

        if (paisDb.isEmpty()) {
            Pais pais = new Pais();
            pais.setNombre("Argentina");
            return paisRepository.save(pais);
        }

        return paisDb.get();
    }

    private Provincia obtenerProvincia(String nombre, Pais pais) {
        Optional<Provincia> provinciaDb = provinciaRepository.findByNombre(nombre);

        if (provinciaDb.isEmpty()) {
            Provincia provincia = new Provincia();
            provincia.setNombre(nombre);
            provincia.setPais(pais);
            return provinciaRepository.save(provincia);
        }

        return provinciaDb.get();
    }

    private Departamento obtenerDepartamento(String nombre, Provincia provincia) {
        Optional<Departamento> departamentoDb = departamentoRepository.findByNombre(nombre);

        if (departamentoDb.isEmpty()) {
            Departamento departamento = new Departamento();
            departamento.setNombre(nombre);
            departamento.setProvincia(provincia);
            return departamentoRepository.save(departamento);
        }

        return departamentoDb.get();
    }

    private void crearLocalidad(String nombre, Departamento departamento) {
        Optional<Localidad> localidadDb = localidadRepository.findByNombre(nombre);

        if (localidadDb.isEmpty()) {
            Localidad localidad = new Localidad();
            localidad.setNombre(nombre);
            localidad.setDepartamento(departamento);

            localidadRepository.save(localidad);
        }
    }
    @CrossOrigin
    @GetMapping("/provincias")
    public Set<Provincia> getProvincias() {
        List<Provincia> provincias = provinciaRepository.findAll();

        return (Set<Provincia>) provincias;
    }

    @CrossOrigin
    @GetMapping("/localidades")
    public Set<Localidad> getLocalidades() {
        List<Localidad> localidades = localidadRepository.findAll();

        return (Set<Localidad>) localidades;
    }

    @CrossOrigin
    @GetMapping("/localidades/{departamentoId}")
    public Set<Localidad> getLocalidadesByDepartamentoId(@PathVariable("departamentoId") Long id) {
        List<Localidad> localidades = localidadRepository.findByIdDepartamento(id);

        return (Set<Localidad>) localidades;
    }

    @CrossOrigin
    @GetMapping("/departamentos/{provinciaId}")
    public Set<Departamento> getDepartamentosByDepartamentoId(@PathVariable("provinciaId") Long id) {
        List<Departamento> departamentos = departamentoRepository.findByProvinciaId(id);

        return (Set<Departamento>) departamentos;
    }

}
