package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.EnumMedida;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Productos.ArticuloVenta;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DetalleStockDTO {
    private Long id;
    private int cantidad;
    private EnumMedida medida;
    private double costoUnitario;
    private double subTotal;
    private String ingredienteNombre;
    private String articuloVentaNombre;
}
