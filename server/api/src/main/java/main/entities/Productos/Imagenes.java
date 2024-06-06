package main.entities.Productos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Categoria;
import main.entities.Restaurante.Empresa;
import main.entities.Restaurante.Sucursal;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Table(name = "imagenes", schema = "buen_sabor")
public class Imagenes implements Serializable {
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
    @JsonIgnoreProperties(value = {"imagenes", "sucursales"}, allowSetters = true)
    @ManyToMany
    @JoinTable(
            name = "imagenes_menu",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_menu")
    )
    private Set<ArticuloMenu> articulosMenu = new HashSet<>();

    @JsonIgnoreProperties(value = {"imagenes", "sucursales"}, allowSetters = true)
    @ManyToMany
    @JoinTable(
            name = "imagenes_articulo",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_articulo")
    )
    private Set<ArticuloVenta> articulosVenta = new HashSet<>();

    @JsonIgnoreProperties(value = {"imagenes", "sucursales"}, allowSetters = true)
    @ManyToMany
    @JoinTable(
            name = "imagenes_promocion",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_promocion")
    )
    private Set<Promocion> promociones = new HashSet<>();

    @JsonIgnoreProperties(value = {"sucursales", "imagenes"}, allowSetters = true)
    @ManyToMany
    @JoinTable(
            name = "imagenes_empresa",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_empresa")
    )
    private Set<Empresa> empresas = new HashSet<>();

    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksIngredientes", "stocksArticulo", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias", "imagenes", "ingredientes", "stocksEntranteSucursal"}, allowSetters = true)
    @ManyToMany
    @JoinTable(
            name = "imagenes_sucursal",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();

    @JsonIgnoreProperties(value = {"subcategorias", "sucursales"}, allowSetters = true)
    @ManyToMany
    @JoinTable(
            name = "imagenes_categoria",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_categoria")
    )
    private Set<Categoria> categorias = new HashSet<>();
}
