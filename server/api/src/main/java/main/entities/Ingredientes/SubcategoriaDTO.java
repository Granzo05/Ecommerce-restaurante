package main.entities.Ingredientes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubcategoriaDTO {
    private Long id;
    private String denominacion;
    private String borrado = "NO";
}