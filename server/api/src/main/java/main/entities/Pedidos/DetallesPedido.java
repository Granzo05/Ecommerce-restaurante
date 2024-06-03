package main.entities.Pedidos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class DetallesPedido implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "cantidad", nullable = false)
    private int cantidad;

    @Column(name = "subtotal", nullable = false)
    private double subTotal;

    @JsonIgnoreProperties({"sucursales"})
    @ManyToOne(optional = true)
    @JoinColumn(name = "id_menu")
    private ArticuloMenu articuloMenu;

    @JsonIgnoreProperties({"sucursales"})
    @ManyToOne(optional = true)
    @JoinColumn(name = "id_articulo")
    private ArticuloVenta articuloVenta;

    @JsonIgnoreProperties({
            "factura", "cliente", "sucursales", "detallesPedido",
            "tipoEnvio", "estado"
    })
    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;
}