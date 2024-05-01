package main.entities.Restaurante.Menu;

import jakarta.persistence.*;
import lombok.*;

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
    @Column(name = "costo")
    private double costo;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "medida")
    private String medida;
    @Column(name = "borrado")
    private String borrado;

}