package main.entities.Restaurante.Menu;

import jakarta.persistence.*;

@Entity
@Table(name = "imagenes_menu", schema = "buen_sabor")
public class ImagenesMenu {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;

    @Column(name = "archivo")
    private byte[] archivo;
    @ManyToOne
    @JoinColumn(name = "menu_imagenes")
    private Menu menu;

    public ImagenesMenu() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public byte[] getArchivo() {
        return archivo;
    }

    public void setArchivo(byte[] archivo) {
        this.archivo = archivo;
    }

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }
}
