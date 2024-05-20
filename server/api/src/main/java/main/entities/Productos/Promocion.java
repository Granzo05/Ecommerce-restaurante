package main.entities.Productos;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Sucursal;
import net.minidev.json.annotate.JsonIgnore;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "promociones", schema = "buen_sabor")
public class Promocion {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "descripcion")
    private String descripcion;
    @Column(name = "fecha_desde")
    private Date fechaDesde;
    @Column(name = "fecha_hasta")
    private Date fechaHasta;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "promocion_articulo",
            joinColumns = @JoinColumn(name = "id_promocion"),
            inverseJoinColumns = @JoinColumn(name = "id_articulo")
    )
    private Set<Articulo> articulos = new HashSet<>();
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "promocion_menu",
            joinColumns = @JoinColumn(name = "id_promocion"),
            inverseJoinColumns = @JoinColumn(name = "id_menu")
    )
    private Set<ArticuloMenu> articulosMenu = new HashSet<>();
    @OneToMany(mappedBy = "promocion")
    private Set<Imagenes> imagenes = new HashSet<>();
    @Column(name = "precio_promocion")
    private double precio;
    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "promocion_sucursal",
            joinColumns = @JoinColumn(name = "id_promocion"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();

}
