package main.entities.Factura;

import jakarta.persistence.*;
import main.entities.Cliente.Cliente;
import main.entities.Pedidos.EnumTipoEnvio;
import main.entities.Pedidos.Pedido;

@Entity
@Table(name = "facturas", schema = "buen_sabor")
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "tipo_factura")
    private TipoFactura tipoFactura;
    @Column(name = "metodo_pago")
    private EnumMetodoPago metodoPago;
    @OneToOne
    @JoinColumn(name = "pedido")
    private Pedido pedido;
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    public Factura() {
    }

    public TipoFactura getTipoFactura() {
        return tipoFactura;
    }

    public void setTipoFactura(TipoFactura tipoFactura) {
        this.tipoFactura = tipoFactura;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EnumMetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        String tipoEnvioUpper = metodoPago.trim().toUpperCase();

        try {
            this.metodoPago = EnumMetodoPago.valueOf(tipoEnvioUpper);
        } catch (IllegalArgumentException e) {
            System.err.println("Tipo de envío no válido: " + metodoPago);
        }
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

}