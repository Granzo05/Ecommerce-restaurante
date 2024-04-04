package main.entities.Restaurante.Menu;

import jakarta.persistence.*;

@Entity
@Table(name = "ingredientes_menu", schema = "buen_sabor")
public class IngredienteMenu {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "ingrediente_id")
    private Ingrediente ingrediente;
    @Column(name = "cantidad")
    private int cantidad;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ingrediente getIngrediente() {
        return ingrediente;
    }

    public void setIngrediente(Ingrediente ingrediente) {
        this.ingrediente = ingrediente;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    @Override
    public String toString() {
        return "IngredienteMenu{" +
                "id=" + id +
                ", ingrediente=" + ingrediente +
                ", cantidad=" + cantidad +
                '}';
    }
}