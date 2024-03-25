package main.entities.Restaurante.Menu;

import jakarta.persistence.Entity;

@Entity
public class IngredienteMenu extends Ingrediente {
    private int cantidad;

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}
