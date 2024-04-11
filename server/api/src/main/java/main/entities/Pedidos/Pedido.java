package main.entities.Pedidos;

import jakarta.persistence.*;
import main.entities.Cliente.Cliente;
import main.entities.Factura.Factura;
import main.entities.Restaurante.Restaurante;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "pedidos", schema = "buen_sabor")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "tipo_envio")
    private EnumTipoEnvio tipoEnvio;
    @Column(name = "estado")
    private String estado;
    @Column(name = "fecha", updatable = false, nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    public Date fechaPedido;
    @Column(name = "borrado")
    private String borrado;
    @OneToOne
    @JoinColumn(name = "id_factura")
    private Factura factura;
    @ManyToOne
    @JoinColumn(name = "id_restaurante")
    private Restaurante restaurante;
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetallesPedido> detallesPedido;

    public Pedido() {
    }

    //En caso que sea retiro en local no es necesario ni domicilio ni telefono del cliente
    public Pedido(EnumTipoEnvio tipoEnvio, Cliente cliente, Restaurante restaurante, Factura factura) {
        this.tipoEnvio = tipoEnvio;
        this.cliente = cliente;
        this.restaurante = restaurante;
        this.factura = factura;
    }

    public Pedido(EnumTipoEnvio tipoEnvio, Cliente clienteId, Restaurante restauranteId, Factura facturaId, String domicilio, long telefono) {
        this.tipoEnvio = tipoEnvio;
        this.cliente = cliente;
        this.restaurante = restaurante;
        this.factura = factura;
    }

    public Cliente getUser() {
        return cliente;
    }

    public void setUser(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getBorrado() {
        return borrado;
    }

    public void setBorrado(String borrado) {
        this.borrado = borrado;
    }

    public String getEstadoPedido() {
        return estado;
    }

    public void setEstadoPedido(String estadoPedido) {
        this.estado = estadoPedido;
    }

    public List<DetallesPedido> getDetallesPedido() {
        return detallesPedido;
    }

    public void setDetallesPedido(List<DetallesPedido> detallesPedido) {
        this.detallesPedido = detallesPedido;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EnumTipoEnvio getTipoEnvio() {
        return tipoEnvio;
    }

    public void setTipoEnvio(EnumTipoEnvio tipoEnvio) {
        this.tipoEnvio = tipoEnvio;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Restaurante getRestaurante() {
        return restaurante;
    }

    public void setRestaurante(Restaurante restaurante) {
        this.restaurante = restaurante;
    }

    public Factura getFactura() {
        return factura;
    }

    public void setFactura(Factura factura) {
        this.factura = factura;
    }

    public Date getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(Date fechaPedido) {
        this.fechaPedido = fechaPedido;
    }
}