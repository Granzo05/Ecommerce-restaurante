package main.entities.Ingredientes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
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
@Table(name = "categorias", schema = "buen_sabor")
public class Categoria implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "borrado")
    private String borrado = "NO";
    @JsonIgnoreProperties(value = {"sucursales"})
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    private Set<Subcategoria> subcategorias = new HashSet<>();
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"})
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "categorias_sucursales",
            joinColumns = @JoinColumn(name = "id_categoria"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();
}