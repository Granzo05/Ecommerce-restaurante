package main.entities.Ingredientes;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class IngredienteMenuDTO {
    private Long id;
    private int cantidad;
    private Medida medida;
    private String ingredienteNombre;
}