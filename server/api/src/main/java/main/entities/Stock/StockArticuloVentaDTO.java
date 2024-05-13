package main.entities.Stock;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.EnumMedida;
import main.entities.Productos.ArticuloVenta;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class StockArticuloVentaDTO extends Stock {
    private Long id;
    private String nombreArticulo;

    public StockArticuloVentaDTO(double precioCompra, int cantidadActual, int cantidadMinima, int cantidadMaxima, EnumMedida medida, Long id1, String nombreArticulo) {
        super(precioCompra, cantidadActual, cantidadMinima, cantidadMaxima, medida);
        this.id = id1;
        this.nombreArticulo = nombreArticulo;
    }
}