package main.entities.Restaurante.Menu;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "ingredientes_menu", schema = "buen_sabor")
public class IngredienteMenu {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "cantidad_ingrediente")
    private int cantidad;
    @Column(name = "medida")
    private String medida;
    @ManyToOne
    @JoinColumn(name = "id_ingrediente")
    private Ingrediente ingrediente;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_menu")
    private Menu menu;
}