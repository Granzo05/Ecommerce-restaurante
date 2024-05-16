package main.entities.Restaurante;

import lombok.Getter;
import lombok.Setter;
import main.entities.Domicilio.DomicilioDTO;

import java.util.Date;
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
    private Sucursal sucursal;

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
