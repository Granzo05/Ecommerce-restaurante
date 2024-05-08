package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.DomicilioDTO;
import net.minidev.json.annotate.JsonIgnore;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class EmpleadoDTO {
    private Long id;
    private String nombre;
    private String email;
    private String cuil;
    private Set<FechaContratacionEmpleadoDTO> fechaContratacionEmpleado;
    private Set<DomicilioDTO> domicilios;
    private Long telefono;
    private Date fechaNacimiento;

    public EmpleadoDTO() {
    }

    public EmpleadoDTO(Long id, String nombre, String email, String cuil, Long telefono, Date fechaNacimiento) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.cuil = cuil;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
    }
}
