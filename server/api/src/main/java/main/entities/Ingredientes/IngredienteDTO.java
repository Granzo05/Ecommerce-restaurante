package main.entities.Ingredientes;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Stock.StockIngredientes;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IngredienteDTO {
    private Long id;
    private String nombre;
}