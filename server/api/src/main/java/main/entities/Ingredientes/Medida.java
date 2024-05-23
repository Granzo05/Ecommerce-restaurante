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
@ToString
@Table(name = "medidas", schema = "buen_sabor")
public class Medida {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "denominacion")
    private String denominacion;
    @Column(name = "borrado")
    private String borrado = "NO";
    @ManyToOne
    @JoinTable(
            name = "categorias_sucursales",
            joinColumns = @JoinColumn(name = "id_categoria"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Sucursal sucursal;
}