package main.controllers;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import main.controllers.EncryptMD5.Encrypt;
import main.entities.Domicilio.*;
import main.repositories.*;
import org.springframework.cglib.core.Local;
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
    private final DomicilioRepository domicilioRepository;



    public PaisController(LocalidadRepository localidadRepository, DepartamentoRepository departamentoRepository, ProvinciaRepository provinciaRepository, PaisRepository paisRepository, DomicilioRepository domicilioRepository) {
        this.localidadRepository = localidadRepository;
        this.departamentoRepository = departamentoRepository;
        this.provinciaRepository = provinciaRepository;
        this.paisRepository = paisRepository;
        this.domicilioRepository = domicilioRepository;
    }

    @CrossOrigin
    @GetMapping("/provincias")
    public Set<ProvinciaDTO> getProvincias() throws Exception {
        List<ProvinciaDTO> provincias = provinciaRepository.findAllDTO();

        for (ProvinciaDTO provincia: provincias) {
            provincia.setNombre(Encrypt.desencriptarString(provincia.getNombre()));
        }

        return new HashSet<>(provincias);
    }

    @CrossOrigin
    @GetMapping("/localidades")
    public Set<LocalidadDTO> getLocalidades() throws Exception {
        List<LocalidadDTO> localidades = localidadRepository.findAllDTO();

        for (LocalidadDTO localidad: localidades) {
            localidad.setNombre(Encrypt.desencriptarString(localidad.getNombre()));
        }

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/localidades/{departamentoId}")
    public Set<LocalidadDTO> getLocalidadesByDepartamentoId(@PathVariable("departamentoId") Long id) throws Exception {
        List<LocalidadDTO> localidades = localidadRepository.findByIdDepartamento(id);

        for (LocalidadDTO localidad: localidades) {
            localidad.setNombre(Encrypt.desencriptarString(localidad.getNombre()));
        }

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/departamentos/{provinciaId}")
    public Set<DepartamentoDTO> getDepartamentosByProvinciaId(@PathVariable("provinciaId") Long id) throws Exception {
        List<DepartamentoDTO> departamentos = departamentoRepository.findByProvinciaId(id);

        for (DepartamentoDTO departamento: departamentos) {
            departamento.setNombre(Encrypt.desencriptarString(departamento.getNombre()));
        }

        return new HashSet<>(departamentos);
    }

    @CrossOrigin
    @GetMapping("/domicilios/{empleadoId}")
    public Set<DomicilioDTO> getDomiciliosByEmpleadoId(@PathVariable("empleadoId") Long id) throws Exception {
        List<DomicilioDTO> domicilios = domicilioRepository.findByIdEmpleadoDTO(id);

        for (DomicilioDTO domicilio: domicilios) {
            domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
            domicilio.getLocalidad().setNombre(Encrypt.desencriptarString(domicilio.getLocalidad().getNombre()));
            domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
        }

        return new HashSet<>(domicilios);
    }


}
