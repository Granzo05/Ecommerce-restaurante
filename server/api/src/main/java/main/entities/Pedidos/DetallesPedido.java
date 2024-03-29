package main.entities.Pedidos;

import main.entities.Factura.Factura;
import main.entities.Restaurante.Menu.Menu;
import jakarta.persistence.*;

@Entity
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
    private Menu menu;
    @ManyToOne
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;

    public DetallesPedido() {
    }

    public DetallesPedido(int cantidad, Menu menu) {
        this.cantidad = cantidad;
        this.menu = menu;
    }

    public double getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(double subTotal) {
        this.subTotal = subTotal;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

}