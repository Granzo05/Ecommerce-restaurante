package main.entities.Ingredientes;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Productos.ArticuloMenu;

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