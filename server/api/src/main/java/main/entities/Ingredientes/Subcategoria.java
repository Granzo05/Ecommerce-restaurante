package main.entities.Ingredientes;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Sucursal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "subcategorias", schema = "buen_sabor")
public class Subcategoria {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "denominacion")
    private String denominacion;
    @Column(name = "borrado")
    private String borrado = "NO";
    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;
    @ManyToOne
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;
}