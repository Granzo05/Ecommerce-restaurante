package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.Medida;
import main.entities.Productos.ArticuloVenta;

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
    private double cantidad;
    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_medida")
    private Medida medida;
    @Column(name = "costo_unitario")
    private double costoUnitario;
    @Column(name = "subtotal")
    private double subTotal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @JoinColumn(name = "id_ingrediente")
    private Ingrediente ingrediente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @JoinColumn(name = "id_articulo")
    private ArticuloVenta articuloVenta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = {"sucursal"}, allowSetters = true)
    @JoinColumn(name = "id_stock_entrante")
    private StockEntrante stockEntrante;

    @Column(name = "modificar_precio")
    private boolean modificarPrecio = false;


}
