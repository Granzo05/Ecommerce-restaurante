package main.entities.Productos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Empresa;
import main.entities.Restaurante.Sucursal;

import java.io.Serializable;

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
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"})
    @ManyToOne
    @JoinTable(
            name = "imagenes_menu",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_menu")
    )
    private ArticuloMenu articuloMenu;
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"})
    @ManyToOne
    @JoinTable(
            name = "imagenes_articulo",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_articulo")
    )
    private ArticuloVenta articuloVenta;
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"})
    @ManyToOne
    @JoinTable(
            name = "imagenes_promocion",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_promocion")
    )
    private Promocion promocion;
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"})
    @ManyToOne
    @JoinTable(
            name = "imagenes_empresa",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_empresa")
    )
    private Empresa empresa;
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"})
    @ManyToOne
    @JoinTable(
            name = "imagenes_sucursal",
            joinColumns = @JoinColumn(name = "id_imagen"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Sucursal sucursal;
}
