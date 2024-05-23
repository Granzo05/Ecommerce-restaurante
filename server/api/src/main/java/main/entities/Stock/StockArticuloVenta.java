package main.entities.Stock;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Productos.ArticuloVenta;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString
@Table(name = "stock_articulos", schema = "buen_sabor")
public class StockArticuloVenta extends Stock implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @OneToOne
    @JoinColumn(name = "id_articulo")
    private ArticuloVenta articuloVenta;
}