package main.entities.Ingredientes;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubcategoriaDTO {
    private Long id;
    private String denominacion;
    private String borrado = "NO";
}