package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Ingrediente;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString
@Table(name = "stock_ingredientes", schema = "buen_sabor")
public class StockIngredientes extends Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @JsonIgnoreProperties(value = {"stock"})
    @OneToOne
    @JoinColumn(name = "id_ingrediente")
    private Ingrediente ingrediente;
}
