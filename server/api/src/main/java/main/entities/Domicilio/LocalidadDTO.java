package main.entities.Domicilio;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LocalidadDTO {
    private Long id;
    private String nombre;
    private Departamento departamento;
}