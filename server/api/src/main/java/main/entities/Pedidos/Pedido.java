package main.entities.Pedidos;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Cliente.Cliente;
import main.entities.Factura.Factura;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "pedidos", schema = "buen_sabor")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "tipo_envio")
    private EnumTipoEnvio tipoEnvio;
    @Column(name = "estado")
    private EnumEstadoPedido estado;
    @Column(name = "fecha_pedido", updatable = false, nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    public Date fechaPedido;
    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";
    @Column(name = "hora_finalizacion")
    private String horaFinalizacion;
    @OneToOne(mappedBy = "pedido")
    private Factura factura;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;
    @OneToMany(fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "pedido")
    private Set<DetallesPedido> detallesPedido = new HashSet<>();
}