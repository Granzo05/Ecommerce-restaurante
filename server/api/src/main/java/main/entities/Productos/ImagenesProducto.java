package main.entities.Productos;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Table(name = "imagenes", schema = "buen_sabor")
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
    @Column(name = "borrado")
    private String borrado = "NO";
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinTable(
            name = "imagenes_menu",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_menu")
    )
    private ArticuloMenu articuloMenu;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinTable(
            name = "imagenes_articulo",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_articulo")
    )
    private ArticuloVenta articuloVenta;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinTable(
            name = "imagenes_promocion",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_promocion")
    )
    private Promocion promocion;

}
