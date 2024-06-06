package main.entities.Factura;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Pedidos.Pedido;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "facturas", schema = "buen_sabor")
public class Factura implements Serializable {
    @Column(name = "fecha_creacion", updatable = false, nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    public LocalDateTime fechaFacturacion;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "tipo_factura")
    private EnumTipoFactura tipoFactura;
    @Column(name = "metodo_pago")

    private EnumMetodoPago metodoPago;
    @JsonIgnoreProperties(value = {
            "factura", "cliente", "sucursales", "detallesPedido",
            "tipoEnvio", "estado", "domicilioEntrega"
    }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;
}