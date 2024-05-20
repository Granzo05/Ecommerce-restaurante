package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.DomicilioDTO;
import main.entities.Productos.Articulo;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;
import main.entities.Productos.Promocion;
import main.entities.Stock.Stock;
import main.entities.Stock.StockEntrante;
import net.minidev.json.annotate.JsonIgnore;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString
@Getter
@Table(name = "sucursales", schema = "buen_sabor")
public class Sucursal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @JsonIgnoreProperties({"departamentos", "sucursal", "empleado", "cliente"})
    @OneToOne(mappedBy = "sucursal", cascade = CascadeType.ALL, orphanRemoval = true)
    private Domicilio domicilio;
    @Column(name = "contraseña")
    private String contraseña;
    @Column(name = "telefono")
    private long telefono;
    @Column(name = "email")
    private String email;
    @Column(name = "privilegios")
    private String privilegios;
    @Column(name = "horario_apertura")
    private LocalTime horarioApertura;
    @Column(name = "horario_cierre")
    private LocalTime horarioCierre;
    @JsonIgnore
    @OneToMany(mappedBy = "sucursal")
    private Set<Empleado> empleados = new HashSet<>();
    @JsonIgnoreProperties({"sucursales"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa")
    private Empresa empresa;
    @Column(name = "borrado")
    private String borrado = "NO";
    @JsonIgnore
    @OneToMany(mappedBy = "sucursal")
    private Set<Stock> stocksSucursal = new HashSet<>();
    @JsonIgnore
    @OneToMany(mappedBy = "sucursal")
    private Set<StockEntrante> stocksEntranteSucursal = new HashSet<>();
    @JsonIgnore
    @ManyToMany(mappedBy = "sucursales")
    private Set<Promocion> promociones = new HashSet<>();
    @JsonIgnoreProperties(value = "sucursal")
    @OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL)
    private Set<LocalidadDelivery> localidadesDisponiblesDelivery = new HashSet<>();
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "articulos_menu_sucursal",
            joinColumns = @JoinColumn(name = "id_sucursal"),
            inverseJoinColumns = @JoinColumn(name = "id_articulo_menu")
    )
    private Set<ArticuloMenu> articulosMenu = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "articulos_venta_sucursal",
            joinColumns = @JoinColumn(name = "id_sucursal"),
            inverseJoinColumns = @JoinColumn(name = "id_articulo_venta")
    )
    private Set<ArticuloVenta> articulosVenta = new HashSet<>();
}