package main.controllers;

import main.controllers.EncryptMD5.Encrypt;
import main.entities.Domicilio.DepartamentoDTO;
import main.entities.Domicilio.DomicilioDTO;
import main.entities.Domicilio.LocalidadDTO;
import main.entities.Domicilio.ProvinciaDTO;
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
    public Set<ProvinciaDTO> getProvincias() throws Exception {
        List<ProvinciaDTO> provincias = provinciaRepository.findAllDTO();

        return new HashSet<>(provincias);
    }

    @CrossOrigin
    @GetMapping("/localidades")
    public Set<LocalidadDTO> getLocalidades() throws Exception {
        List<LocalidadDTO> localidades = localidadRepository.findAllDTO();

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/localidades/{nombreDepartamento}/{nombreProvincia}")
    public Set<LocalidadDTO> getLocalidadesByNombreDepartamentoAndProvincia(@PathVariable("nombreDepartamento") String nombreDepartamento, @PathVariable("nombreProvincia") String nombreProvincia) throws Exception {
        List<LocalidadDTO> localidades = localidadRepository.findByNombreDepartamentoAndProvincia(nombreDepartamento, nombreProvincia);

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/localidades/departamento/{nombreDepartamento}")
    public Set<LocalidadDTO> getLocalidadesByNombreDepartamento(@PathVariable("nombreDepartamento") String nombreDepartamento) throws Exception {
        List<LocalidadDTO> localidades = localidadRepository.findByNombreDepartamento(nombreDepartamento);

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/localidades/provincia/{nombreProvincia}")
    public Set<LocalidadDTO> getLocalidadesByNombreProvincia(@PathVariable("nombreProvincia") String nombreProvincia) throws Exception {
        List<LocalidadDTO> localidades = localidadRepository.findByNombreProvincia(nombreProvincia);

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/departamentos/{nombreProvincia}")
    public Set<DepartamentoDTO> getDepartamentosByNombreProvincia(@PathVariable("nombreProvincia") String nombre) throws Exception {
        List<DepartamentoDTO> departamentos = departamentoRepository.findByNombreProvincia(nombre);

        return new HashSet<>(departamentos);
    }

    @CrossOrigin
    @GetMapping("/domicilios/{empleadoId}")
    public Set<DomicilioDTO> getDomiciliosByEmpleadoId(@PathVariable("empleadoId") Long id) throws Exception {
        List<DomicilioDTO> domicilios = domicilioRepository.findByIdEmpleadoDTO(id);

        try {
            for (DomicilioDTO domicilio : domicilios) {
                domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
            }
        } catch (IllegalBlockSizeException e) {
            System.out.println(e);
        }


        return new HashSet<>(domicilios);
    }


}
