package main.entities.Productos;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Pedidos.EnumMedida;
import main.entities.Stock.Stock;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString
@Table(name = "articulos_venta", schema = "buen_sabor")
public class ArticuloVenta extends Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "tipo")
    private EnumTipoArticuloVenta tipo;
    @Column(name = "medida")
    private EnumMedida medida;
    @Column(name = "cantidad_medida")
    private int cantidadMedida;
    @OneToOne(cascade = CascadeType.ALL)
    private Stock stock;
}
