package main.entities.Stock;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.EnumMedida;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString
@Table(name = "fecha_stock", schema = "buen_sabor")
public class FechaStock {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "cantidad_llegada")
    private int cantidadLlegada;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinTable(
            name = "fecha_stock_ingredientes",
            joinColumns = @JoinColumn(name = "id_fecha"),
            inverseJoinColumns = @JoinColumn(name = "id_stock_ingrediente")
    )
    private StockIngredientes stockIngredientes;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinTable(
            name = "fecha_stock_articulos",
            joinColumns = @JoinColumn(name = "id_fecha"),
            inverseJoinColumns = @JoinColumn(name = "id_stock_articulo")
    )
    private StockArticuloVenta stockArticuloVenta;
    @Column(name = "medida")
    private EnumMedida medida;
    @Column(name = "fecha")
    private Date fecha;

}
