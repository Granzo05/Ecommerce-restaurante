package main.entities.Restaurante.Stock;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Menu.Ingrediente;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "stock", schema = "buen_sabor")
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "cantidad_actual")
    private int cantidadActual;
    @Column(name = "cantidad_minima")
    private int cantidadMinima;
    @Column(name = "cantidad_maxima")
    private int cantidadMaxima;
    @OneToMany(mappedBy = "stock")
    public List<FechaStock> fechaIngreso;
    @Column(name = "borrado")
    private String borrado;
    @OneToOne
    private Ingrediente ingrediente;

}
