package main.entities.Restaurante.Menu;

import jakarta.persistence.*;
import main.entities.Restaurante.Restaurante;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "menus", schema = "buen_sabor")
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "tiempo")
    private int tiempoCoccion;
    @Column(name = "tipo")
    private String tipo;
    @Column(name = "comensales")
    private int comensales;
    @Column(name = "precio")
    private double precio;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "descripcion")
    private String descripcion;

    @Transient
    @OneToMany
    private List<IngredienteMenu> ingredientes = new ArrayList<>();
    @Column(name = "borrado")
    private String borrado;

    public Menu() {
    }

    public Menu(int tiempoCoccion, String tipo, int comensales, double precio) {
        this.tiempoCoccion = tiempoCoccion;
        this.tipo = tipo;
        this.comensales = comensales;
        this.precio = precio;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getBorrado() {
        return borrado;
    }

    public void setBorrado(String borrado) {
        this.borrado = borrado;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
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

    public int getTiempoCoccion() {
        return tiempoCoccion;
    }

    public void setTiempoCoccion(int tiempoCoccion) {
        this.tiempoCoccion = tiempoCoccion;
    }


    public int getComensales() {
        return comensales;
    }

    public void setComensales(int comensales) {
        this.comensales = comensales;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public List<IngredienteMenu> getIngredientes() {
        return ingredientes;
    }

    public void setIngredientes(List<IngredienteMenu> ingredientes) {
        this.ingredientes = ingredientes;
    }
    public void addIngrediente(IngredienteMenu ingrediente) {
        this.ingredientes.add(ingrediente);
    }

    @Override
    public String toString() {
        return "Menu{" +
                "id=" + id +
                ", tiempoCoccion=" + tiempoCoccion +
                ", tipo=" + tipo +
                ", comensales=" + comensales +
                ", precio=" + precio +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", ingredientes=" + ingredientes +
                ", borrado='" + borrado + '\'' +
                '}';
    }

    @ManyToOne(optional = false)
    private IngredienteMenu ingredienteMenus;

    public IngredienteMenu getIngredienteMenus() {
        return ingredienteMenus;
    }

    public void setIngredienteMenus(IngredienteMenu ingredienteMenus) {
        this.ingredienteMenus = ingredienteMenus;
    }
}
