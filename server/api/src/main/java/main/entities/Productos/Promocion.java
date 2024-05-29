package main.entities.Productos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.DetalleStock;
import net.minidev.json.annotate.JsonIgnore;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "promociones", schema = "buen_sabor")
public class Promocion implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "descripcion")
    private String descripcion;
    @Column(name = "fecha_desde")
    private LocalDateTime fechaDesde;
    @Column(name = "fecha_hasta")
    private LocalDateTime fechaHasta;
    @JsonIgnoreProperties(value = {"promocion"}, allowSetters = true)
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "promocion", cascade = CascadeType.ALL)
    private Set<DetallePromocion> detallesPromocion = new HashSet<>();
    @JsonIgnoreProperties(value = {"articuloMenu", "articuloVenta", "promocion", "empresa", "sucursal", "categoria"}, allowSetters = true)
    @OneToMany(mappedBy = "promocion")
    private Set<Imagenes> imagenes = new HashSet<>();
    @Column(name = "precio_promocion")
    private double precio;
    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";
    @JsonIgnoreProperties(value = {"empleados", "empresa", "contraseña", "stocksSucursal", "stocksEntranteSucursal", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "promocion_sucursal",
            joinColumns = @JoinColumn(name = "id_promocion"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();
}
