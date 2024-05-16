package main.entities.Ingredientes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IngredienteMenuDTO {
    private Long id;
    private int cantidad;
    private EnumMedida medida;
    private String ingredienteNombre;
}