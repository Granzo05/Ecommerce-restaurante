package main.entities.Productos;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.IngredienteMenu;

import java.util.HashSet;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
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
    @OneToMany(mappedBy = "menu", fetch = FetchType.LAZY, orphanRemoval = true)
    private HashSet<IngredienteMenu> ingredientesMenu = new HashSet<>();
    @OneToMany(mappedBy = "menu", fetch = FetchType.LAZY, orphanRemoval = true)
    private HashSet<ImagenesProducto> imagenes = new HashSet<>();
    @Column(name = "borrado")
    private String borrado;

    public void addImagen(ImagenesProducto imagen) {
        this.imagenes.add(imagen);
    }
}
