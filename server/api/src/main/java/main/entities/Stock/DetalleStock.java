package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.Medida;
import main.entities.Productos.ArticuloVenta;

import javax.print.attribute.standard.Media;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString
@Table(name = "detalle_stock", schema = "buen_sabor")
public class DetalleStock {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "cantidad")
    private int cantidad;
    @JsonIgnoreProperties(value = {"sucursales", "detalleStock"})
    @ManyToOne
    @JoinColumn(name = "id_medida")
    private Medida medida;
    @Column(name = "costo_unitario")
    private double costoUnitario;
    @Column(name = "subtotal")
    private double subTotal;
    @ManyToOne
    @JsonIgnoreProperties(value = {"stock"})
    @JoinColumn(name = "id_ingrediente")
    private Ingrediente ingrediente;
    @ManyToOne
    @JsonIgnoreProperties(value = {"stock"})
    @JoinColumn(name = "id_articulo")
    private ArticuloVenta articuloVenta;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = {"sucursal"})
    @JoinColumn(name = "id_stock_entrante")
    private StockEntrante stockEntrante;

}
