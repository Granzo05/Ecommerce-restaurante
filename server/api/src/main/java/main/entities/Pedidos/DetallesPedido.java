package main.entities.Pedidos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;
import main.entities.Productos.Promocion;

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

    @JsonIgnoreProperties({"sucursales"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_menu")
    private ArticuloMenu articuloMenu;

    @JsonIgnoreProperties({"sucursales"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_articulo")
    private ArticuloVenta articuloVenta;

    @JsonIgnoreProperties({"sucursales"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_promocion")
    private Promocion promocion;

    @JsonIgnoreProperties({
            "factura", "cliente", "sucursales", "detallesPedido",
            "tipoEnvio", "estado", "domicilioEntrega"
    })
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;
}