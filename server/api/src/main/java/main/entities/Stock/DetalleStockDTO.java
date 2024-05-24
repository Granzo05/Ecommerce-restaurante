package main.entities.Stock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Ingredientes.Medida;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DetalleStockDTO {
    private Long id;
    private int cantidad;
    private Medida medida;
    private double costoUnitario;
    private double subTotal;
    private String ingredienteNombre;
    private String articuloVentaNombre;

    public DetalleStockDTO(Long id, int cantidad, Medida medida, double costoUnitario, double subTotal, String nombre) {
        this.id = id;
        this.cantidad = cantidad;
        this.medida = medida;
        this.costoUnitario = costoUnitario;
        this.subTotal = subTotal;
        this.articuloVentaNombre = nombre;
        this.ingredienteNombre = nombre;
    }
}
