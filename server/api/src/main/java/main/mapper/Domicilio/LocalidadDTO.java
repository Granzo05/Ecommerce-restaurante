package main.mapper.Domicilio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LocalidadDTO {

    private Long id;

    private String nombre;

    private DepartamentoDTO departamento;
}