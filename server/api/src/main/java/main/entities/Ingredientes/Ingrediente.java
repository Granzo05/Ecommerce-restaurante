package main.entities.Ingredientes;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Stock.StockIngredientes;
import net.minidev.json.annotate.JsonIgnore;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "ingredientes", schema = "buen_sabor")
public class Ingrediente {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "ingrediente")
    private StockIngredientes stock;
}