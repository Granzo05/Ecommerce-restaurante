package main.entities.Productos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Ingredientes.Subcategoria;
import main.entities.Restaurante.Sucursal;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString
@Table(name = "articulos_menu", schema = "buen_sabor")
public class ArticuloMenu {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "tiempo")
    private int tiempoCoccion;

    @Column(name = "nombre")
    private String nombre;

    @JsonIgnoreProperties(value = {"subcategorias", "sucursales", "imagenes"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @JsonIgnoreProperties(value = {"categoria", "sucursales"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_subcategoria")
    private Subcategoria subcategoria;

    @Column(name = "precio_venta")
    private double precioVenta;

    @Column(name = "comensales")
    private int comensales;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "borrado")
    private String borrado = "NO";

    @JsonIgnoreProperties(value = {"articuloMenu"}, allowSetters = true)
    @OneToMany(mappedBy = "articuloMenu", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<IngredienteMenu> ingredientesMenu = new HashSet<>();

    @JsonIgnoreProperties(value = {"articuloMenu", "articuloVenta", "promocion", "empresa", "sucursal", "categoria", "empleados"}, allowSetters = true)
    @ManyToMany(mappedBy = "articulosMenu", fetch = FetchType.EAGER)
    private Set<Imagenes> imagenes = new HashSet<>();

    @JsonIgnoreProperties(value = {"domicilios", "empleados", "empresa", "stocksIngredientes", "stocksArticulo", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias", "imagenes", "ingredientes", "stocksEntranteSucursal"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "articulos_menu_sucursales",
            joinColumns = @JoinColumn(name = "id_menu"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();

    @Column(name = "ganancia")
    private double ganancia;
}
