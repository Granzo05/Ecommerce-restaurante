package main.entities.Restaurante.Menu;

import jakarta.persistence.*;

@Entity
@Table(name = "imagenes_menu", schema = "buen_sabor")
public class ImagenesMenu {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "ruta")
    private String ruta;
    @ManyToOne
    @JoinColumn(name = "menu_id")
    private Menu menu;

    public ImagenesMenu() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRuta() {
        return ruta;
    }

    public void setRuta(String ruta) {
        this.ruta = ruta;
    }

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }
}
