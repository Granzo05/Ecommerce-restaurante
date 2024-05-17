package main.entities.Pedidos;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString
@Table(name = "detalles_pedido", schema = "buen_sabor")
public class DetallesPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "cantidad")
    private int cantidad;
    @Column(name = "subtotal")
    private double subTotal;
    @OneToOne
    @JoinColumn(name = "id_menu")
    private ArticuloMenu articuloMenu;
    @OneToOne
    @JoinColumn(name = "id_articulo")
    private ArticuloVenta articuloVenta;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;

}