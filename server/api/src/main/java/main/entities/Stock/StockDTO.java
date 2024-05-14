package main.entities.Stock;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.EnumMedida;
import main.entities.Restaurante.Sucursal;
import net.minidev.json.annotate.JsonIgnore;

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
