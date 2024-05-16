package main.entities.Stock;

import lombok.*;
import main.entities.Ingredientes.EnumMedida;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class StockDTO {
    private Long id;
    private String nombre;
    private double precioCompra;
    private int cantidadActual;
    private int cantidadMinima;
    private int cantidadMaxima;
    private EnumMedida medida;
}
