package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.Medida;
import main.entities.Productos.ArticuloVenta;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DetalleStockDTO {
    private Long id;
    private int cantidad;
    @JsonIgnoreProperties(value = {"sucursales"})
    private Medida medida;
    private double costoUnitario;
    private double subtotal;
    @JsonIgnoreProperties(value = {"imagenes", "sucursales", "borrado", "subcategoria", "categoria", "medida", "cantidadMedida"})
    private ArticuloVenta articuloVenta;
    private Ingrediente ingrediente;

    public DetalleStockDTO(Long id, int cantidad, Medida medida, double costoUnitario, double subTotal, ArticuloVenta articuloVenta) {
        this.id = id;
        this.cantidad = cantidad;
        this.medida = medida;
        this.costoUnitario = costoUnitario;
        this.subtotal = subTotal;
        this.articuloVenta = articuloVenta;
    }

    public DetalleStockDTO(Long id, int cantidad, Medida medida, double costoUnitario, double subTotal, Ingrediente ingrediente) {
        this.id = id;
        this.cantidad = cantidad;
        this.medida = medida;
        this.costoUnitario = costoUnitario;
        this.subtotal = subTotal;
        this.ingrediente = ingrediente;
    }
}
