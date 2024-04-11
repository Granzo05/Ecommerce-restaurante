package main.entities.Restaurante.Menu;

import jakarta.persistence.*;

@Entity
@Table(name = "ingredientes", schema = "buen_sabor")
public class Ingrediente {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "costo")
    private double costo;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "medida")
    private String medida;
    @Column(name = "borrado")
    private String borrado;

    public Ingrediente() {
    }
    public Ingrediente(double costo, String nombre) {
        this.costo = costo;
        this.nombre = nombre;
    }

    public double getCosto() {
        return costo;
    }

    public void setCosto(double costo) {
        this.costo = costo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMedida() {
        return medida;
    }

    public void setMedida(String medida) {
        this.medida = medida;
    }

    public String getBorrado() {
        return borrado;
    }

    public void setBorrado(String borrado) {
        this.borrado = borrado;
    }

    @Override
    public String toString() {
        return "Ingrediente{" +
                "id=" + id +
                ", costo=" + costo +
                ", nombre='" + nombre + '\'' +
                ", medida='" + medida + '\'' +
                '}';
    }
}