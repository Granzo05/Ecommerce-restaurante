package main.entities.Productos;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "precio_venta")
    private double precioVenta;
    @OneToMany(mappedBy = "articulo", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.ALL)
    private Set<ImagenesProducto> imagenes = new HashSet<>();
    @Column(name = "borrado")
    private String borrado = "NO";
    @ManyToMany(mappedBy = "articulos", fetch = FetchType.LAZY)
    private Set<Promocion> promociones = new HashSet<>();

}
