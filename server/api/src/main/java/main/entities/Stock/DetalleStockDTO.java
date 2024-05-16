package main.entities.Stock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Ingredientes.EnumMedida;

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
