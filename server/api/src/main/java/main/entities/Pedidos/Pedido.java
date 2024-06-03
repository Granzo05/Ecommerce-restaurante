package main.entities.Pedidos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Cliente.Cliente;
import main.entities.Factura.Factura;
import main.entities.Restaurante.Sucursal;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "pedidos", schema = "buen_sabor")
public class Pedido implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "tipo_envio")
    private EnumTipoEnvio tipoEnvio;

    @Column(name = "estado")
    private EnumEstadoPedido estado;

    @Column(name = "fecha_pedido", updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime fechaPedido;

    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";

    @Column(name = "hora_finalizacion")
    private String horaFinalizacion;

    @JsonIgnoreProperties(value = {"pedido"}, allowSetters = true)
    @OneToOne(mappedBy = "pedido", optional = true)
    private Factura factura;

    @JsonIgnoreProperties(value = {"pedidos"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @JsonIgnoreProperties(value = {"pedido"}, allowSetters = true)
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "pedido", cascade = CascadeType.ALL)
    private Set<DetallesPedido> detallesPedido = new HashSet<>();

    @JsonIgnoreProperties(value = {"empleados", "empresa", "contraseña", "stocksSucursal", "stocksEntranteSucursal", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "pedidos_sucursales",
            joinColumns = @JoinColumn(name = "id_pedido"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();
}