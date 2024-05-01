package main.entities.Factura;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Cliente.Cliente;
import main.entities.Pedidos.Pedido;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "facturas", schema = "buen_sabor")
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "tipo_factura")
    private EnumTipoFactura tipoFactura;
    @Column(name = "metodo_pago")
    private EnumMetodoPago metodoPago;
    @Column(name = "fecha_creacion", updatable = false, nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    public Date fechaFacturacion;
    @Column(name = "total")
    private double total;
    @OneToOne(mappedBy = "factura")
    private Pedido pedido;


    public void setMetodoPago(String metodoPago) {
        String tipoEnvioUpper = metodoPago.trim().toUpperCase();

        try {
            this.metodoPago = EnumMetodoPago.valueOf(tipoEnvioUpper);
        } catch (IllegalArgumentException e) {
            System.err.println("Tipo de envío no válido: " + metodoPago);
        }
    }

    public void setTipoFactura(String tipo) {
        String tipoFacturaUpper = tipo.trim().toUpperCase();

        try {
            this.tipoFactura = EnumTipoFactura.valueOf(tipoFacturaUpper);
        } catch (IllegalArgumentException e) {
            System.err.println("Tipo de envío no válido: " + metodoPago);
        }
    }


}