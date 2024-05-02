package main.entities.Productos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Ingredientes.IngredienteMenu;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
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
    @OneToMany(mappedBy = "articuloMenu", cascade = CascadeType.ALL)
    private Set<IngredienteMenu> ingredientesMenu = new HashSet<>();

}
