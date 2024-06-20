package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.Medida;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;
import main.entities.Productos.Imagenes;
import main.entities.Productos.Promocion;
import main.entities.Stock.StockArticuloVenta;
import main.entities.Stock.StockEntrante;
import main.entities.Stock.StockIngredientes;

import java.io.Serializable;
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
public class Sucursal implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonIgnoreProperties(value = {"cliente", "empleado", "sucursal"}, allowSetters = true)
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "sucursal", cascade = CascadeType.ALL)
    private Set<Domicilio> domicilios = new HashSet<>();

    @Column(name = "contraseña")
    private String contraseña;

    @Column(name = "telefono")
    private Long telefono;

    @Column(name = "email")
    private String email;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "horario_apertura")
    private LocalTime horarioApertura;

    @Column(name = "horario_cierre")
    private LocalTime horarioCierre;

    @JsonIgnoreProperties(value = {"domicilios", "sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Empleado> empleados = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales", "imagenes"}, allowSetters = true)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_empresa")
    private Empresa empresa;

    @Column(name = "borrado")
    private String borrado = "NO";

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.LAZY)
    private Set<StockIngredientes> stocksIngredientes = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.LAZY)
    private Set<StockArticuloVenta> stocksArticulo = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Ingrediente> ingredientes = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.LAZY)
    private Set<StockEntrante> stocksEntranteSucursal = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Promocion> promociones = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursal"}, allowSetters = true)
    @OneToMany(mappedBy = "sucursal", cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    private Set<LocalidadDelivery> localidadesDisponiblesDelivery = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ArticuloMenu> articulosMenu = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ArticuloVenta> articulosVenta = new HashSet<>();

    @JsonIgnoreProperties(value = {"articuloMenu", "articuloVenta", "promocion", "empresa", "sucursal", "categoria"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.EAGER)
    private Set<Imagenes> imagenes = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Medida> medidas = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales", "subcategorias"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Categoria> categorias = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Roles> roles = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<PrivilegiosSucursales> privilegios = new HashSet<>();

}
