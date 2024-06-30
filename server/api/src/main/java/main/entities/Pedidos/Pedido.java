package main.entities.Pedidos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.Domicilio;
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

    @Column(name = "fecha_entrega", updatable = false)
    private LocalDateTime fechaEntrega;

    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";

    @Column(name = "hora_finalizacion")
    private String horaFinalizacion;

    @JsonIgnoreProperties(value = {"pedido"}, allowSetters = true)
    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    private Factura factura;

    @JsonIgnoreProperties(value = {"domicilios", "pedidos"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @JsonIgnoreProperties(value = {"cliente", "sucursal", "empleado"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_domicilio_entrega")
    private Domicilio domicilioEntrega;

    @JsonIgnoreProperties(value = {"pedido"}, allowSetters = true)
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "pedido", cascade = CascadeType.ALL)
    private Set<DetallesPedido> detallesPedido = new HashSet<>();

    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksIngredientes", "stocksArticulo", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias", "imagenes", "ingredientes", "stocksEntranteSucursal"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "pedidos_sucursales",
            joinColumns = @JoinColumn(name = "id_pedido"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();

    @Column(name = "preferencia_mp")
    private String preferencia;
}