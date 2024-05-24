package main.entities.Ingredientes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Productos.ArticuloMenu;
import org.hibernate.annotations.Cascade;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString
@Table(name = "ingredientes_menu", schema = "buen_sabor")
public class IngredienteMenu {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "cantidad_ingrediente")
    private int cantidad;
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"})
    @OneToOne
    @JoinColumn(name = "id_medida")
    private Medida medida;
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ingrediente")
    @Cascade(org.hibernate.annotations.CascadeType.DETACH)
    private Ingrediente ingrediente;
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"})
    @ManyToOne
    @JoinColumn(name = "id_menu")
    @Cascade(org.hibernate.annotations.CascadeType.DETACH)
    private ArticuloMenu articuloMenu;

}