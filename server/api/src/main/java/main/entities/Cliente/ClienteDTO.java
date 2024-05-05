package main.entities.Cliente;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.DomicilioDTO;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClienteDTO {
    private Long id;
    private String nombre;
    private String email;
    private Set<DomicilioDTO> domicilios = new HashSet<>();
    private long telefono;
    private String contraseña;
    public Date fechaRegistro;
    public Date fechaNacimiento;
    private String borrado = "NO";

    // Necesarios para los repositorios
    public ClienteDTO(String email) {
        this.email = email;
    }

    public ClienteDTO(Long id, String nombre, String email, long telefono) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
    }
}

