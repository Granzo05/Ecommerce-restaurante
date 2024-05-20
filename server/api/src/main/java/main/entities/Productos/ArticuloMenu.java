package main.entities.Productos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.IngredienteMenu;
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
public class ArticuloMenu extends Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "tiempo")
    private int tiempoCoccion;
    @Column(name = "tipo")
    private EnumTipoArticuloComida tipo;
    @Column(name = "comensales")
    private int comensales;
    @Column(name = "descripcion")
    private String descripcion;
    @JsonIgnoreProperties(value = {"articuloMenu"})
    @OneToMany(mappedBy = "articuloMenu", cascade = CascadeType.ALL)
    private Set<IngredienteMenu> ingredientesMenu = new HashSet<>();
    @JsonIgnoreProperties(value = {"articuloMenu"})
    @OneToMany(mappedBy = "articuloMenu", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.ALL)
    private Set<Imagenes> imagenes = new HashSet<>();
    @JsonIgnoreProperties(value = {"articuloMenu"})
    @ManyToMany(mappedBy = "articulosMenu", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Sucursal> sucursales = new HashSet<>();
}
