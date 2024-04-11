package main.entities.Restaurante.Menu;

import jakarta.persistence.*;
import main.entities.Restaurante.Restaurante;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "stock", schema = "buen_sabor")
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "cantidad")
    private int cantidad;
    @Column(name = "fecha_llegada", updatable = false, nullable = false)
    public Date fechaIngreso;
    @Column(name = "borrado")
    private String borrado;
    @OneToOne
    private Ingrediente ingrediente;

    public Stock() {
    }

    public String getBorrado() {
        return borrado;
    }

    public void setBorrado(String borrado) {
        this.borrado = borrado;
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

    public Ingrediente getIngrediente() {
        return ingrediente;
    }

    public void setIngrediente(Ingrediente ingrediente) {
        this.ingrediente = ingrediente;
    }

    public Date getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(Date fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    @Override
    public String toString() {
        return "Stock{" +
                "id=" + id +
                ", cantidad=" + cantidad +
                ", fechaIngreso=" + fechaIngreso +
                ", borrado='" + borrado + '\'' +
                ", ingrediente=" + ingrediente +
                '}';
    }
}
