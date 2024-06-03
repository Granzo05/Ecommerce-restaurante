package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.Medida;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;
import main.entities.Productos.Imagenes;
import main.entities.Productos.Promocion;
import main.entities.Stock.Stock;
import main.entities.Stock.StockEntrante;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

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

    @JsonIgnoreProperties(value = {"cliente", "sucursal", "empleado"})
    @OneToOne(mappedBy = "sucursal", cascade = CascadeType.ALL, orphanRemoval = true)
    private Domicilio domicilio;

    @Column(name = "contraseña")
    private String contraseña;

    @Column(name = "telefono")
    private Long telefono;

    @Column(name = "email")
    private String email;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "privilegios")
    private String privilegios;

    @Column(name = "horario_apertura")
    private LocalTime horarioApertura;

    @Column(name = "horario_cierre")
    private LocalTime horarioCierre;

    @JsonIgnoreProperties(value = {"domicilios", "sucursal"}, allowSetters = true)
    @OneToMany(mappedBy = "sucursal")
    private Set<Empleado> empleados = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales", "imagenes"}, allowSetters = true)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_empresa")
    private Empresa empresa;

    @Column(name = "borrado")
    private String borrado = "NO";

    @JsonIgnoreProperties(value = {"sucursal"}, allowSetters = true)
    @OneToMany(mappedBy = "sucursal", fetch = FetchType.LAZY)
    private Set<Stock> stocksSucursal = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursal"}, allowSetters = true)
    @OneToMany(mappedBy = "sucursal", fetch = FetchType.LAZY)
    private Set<StockEntrante> stocksEntranteSucursal = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.EAGER)
    private Set<Promocion> promociones = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursal"}, allowSetters = true)
    @OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL)
    private Set<LocalidadDelivery> localidadesDisponiblesDelivery = new HashSet<>();

    @JsonIgnoreProperties(value = {"imagenes", "sucursales"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "articulos_menu_sucursal",
            joinColumns = @JoinColumn(name = "id_sucursal"),
            inverseJoinColumns = @JoinColumn(name = "id_articulo_menu")
    )
    private Set<ArticuloMenu> articulosMenu = new HashSet<>();

    @JsonIgnoreProperties(value = {"imagenes", "sucursales"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "articulos_venta_sucursal",
            joinColumns = @JoinColumn(name = "id_sucursal"),
            inverseJoinColumns = @JoinColumn(name = "id_articulo_venta")
    )
    private Set<ArticuloVenta> articulosVenta = new HashSet<>();

    @JsonIgnoreProperties(value = {"articuloMenu", "articuloVenta", "promocion", "empresa", "sucursal", "categoria"}, allowSetters = true)
    @OneToMany(mappedBy = "sucursal", fetch = FetchType.LAZY)
    private Set<Imagenes> imagenes = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Medida> medidas = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales", "subcategorias", "imagenes"}, allowSetters = true)
    @ManyToMany(mappedBy = "sucursales", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Categoria> categorias = new HashSet<>();

}
