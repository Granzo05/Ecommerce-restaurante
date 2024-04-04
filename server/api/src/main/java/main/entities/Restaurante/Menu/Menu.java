package main.entities.Restaurante.Menu;

import main.entities.Restaurante.Restaurante;
import jakarta.persistence.*;

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
    @OneToMany
    private List<IngredienteMenu> ingredientes = new ArrayList<>();
    @ElementCollection
    @CollectionTable(name = "menu_imagenes", joinColumns = @JoinColumn(name = "menu_id"))
    @Column(name = "imagen")
    private List<byte[]> imagenes = new ArrayList<>();
    @Column(name = "borrado")
    private String borrado;
    @ManyToOne
    @JoinColumn(name = "id_restaurante")
    private Restaurante restaurante;

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

    public List<byte[]> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<byte[]> imagenes) {
        this.imagenes = imagenes;
    }

    public void addImagen(byte[] imagen) {
        this.imagenes.add(imagen);
    }


    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Restaurante getRestaurante() {
        return restaurante;
    }

    public void setRestaurante(Restaurante restaurante) {
        this.restaurante = restaurante;
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
                ", imagenes=" + imagenes +
                ", borrado='" + borrado + '\'' +
                ", restaurante=" + restaurante +
                '}';
    }
}
