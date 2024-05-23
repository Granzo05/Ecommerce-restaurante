package main.entities.Ingredientes;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Sucursal;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "categorias", schema = "buen_sabor")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "denominacion")
    private String denominacion;
    @Column(name = "borrado")
    private String borrado = "NO";
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Subcategoria> subcategorias = new HashSet<>();
    @ManyToOne
    @JoinTable(
            name = "categorias_sucursales",
            joinColumns = @JoinColumn(name = "id_categoria"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Sucursal sucursal;
}