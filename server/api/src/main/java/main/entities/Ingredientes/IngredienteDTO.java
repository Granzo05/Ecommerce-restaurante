package main.entities.Ingredientes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IngredienteDTO {
    private Long id;
    private String nombre;
    private String borrado;
}