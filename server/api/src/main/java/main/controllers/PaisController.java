package main.controllers;

import main.EncryptMD5.Encrypt;
import main.entities.Domicilio.Departamento;
import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.Localidad;
import main.entities.Domicilio.Provincia;
import main.repositories.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.IllegalBlockSizeException;
import java.util.HashSet;
import java.util.List;
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
    public Set<Provincia> getProvincias() throws Exception {
        List<Provincia> provincias = provinciaRepository.findAll();

        return new HashSet<>(provincias);
    }

    @CrossOrigin
    @GetMapping("/localidades")
    public Set<Localidad> getLocalidades() throws Exception {
        List<Localidad> localidades = localidadRepository.findAll();

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/localidades/{nombreDepartamento}/{nombreProvincia}")
    public Set<Localidad> getLocalidadesByNombreDepartamentoAndProvincia(@PathVariable("nombreDepartamento") String nombreDepartamento, @PathVariable("nombreProvincia") String nombreProvincia) throws Exception {
        List<Localidad> localidades = localidadRepository.findByNombreDepartamentoAndProvincia(nombreDepartamento, nombreProvincia);

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/localidades/departamento/{nombreDepartamento}")
    public Set<Localidad> getLocalidadesByNombreDepartamento(@PathVariable("nombreDepartamento") String nombreDepartamento) throws Exception {
        List<Localidad> localidades = localidadRepository.findByNombreDepartamento(nombreDepartamento);

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/localidades/provincia/{nombreProvincia}")
    public Set<Localidad> getLocalidadesByNombreProvincia(@PathVariable("nombreProvincia") String nombreProvincia) throws Exception {
        List<Localidad> localidades = localidadRepository.findByNombreProvincia(nombreProvincia);

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/departamentos/{nombreProvincia}")
    public Set<Departamento> getDepartamentosByNombreProvincia(@PathVariable("nombreProvincia") String nombre) throws Exception {
        List<Departamento> departamentos = departamentoRepository.findByNombreProvincia(nombre);

        return new HashSet<>(departamentos);
    }

    @CrossOrigin
    @GetMapping("/domicilios/{empleadoId}")
    public Set<Domicilio> getDomiciliosByEmpleadoId(@PathVariable("empleadoId") Long id) throws Exception {
        List<Domicilio> domicilios = domicilioRepository.findByIdEmpleadoDTO(id);

        try {
            for (Domicilio domicilio : domicilios) {
                domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
            }
        } catch (IllegalBlockSizeException e) {
            System.out.println(e);
        }


        return new HashSet<>(domicilios);
    }


}
