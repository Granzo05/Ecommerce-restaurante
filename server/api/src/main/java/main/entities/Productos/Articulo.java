package main.entities.Productos;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Entity
public abstract class Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "precio_venta")
    private double precioVenta;
    @ManyToMany(mappedBy = "articulos", fetch = FetchType.LAZY)
    private Set<Promocion> promociones = new HashSet<>();
    @Transient
    private Set<ImagenesDTO> imagenesDTO = new HashSet<>();
    public Articulo(String nombre, double precioVenta) {
        this.nombre = nombre;
        this.precioVenta = precioVenta;
    }
}
