package main.entities.Restaurante.Menu;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "imagenes_menu", schema = "buen_sabor")
public class ImagenesProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "ruta")
    private String ruta;
    @Column(name = "formato")
    private String formato;
    @Column(name = "peso")
    private long peso;
    @ManyToOne
    @JoinColumn(name = "id_menu")
    private Menu idMenu;
    @ManyToOne
    @JoinColumn(name = "id_articulo")
    private Articulo idArticulo;
}
