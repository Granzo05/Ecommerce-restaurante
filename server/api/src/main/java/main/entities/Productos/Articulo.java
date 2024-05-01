package main.entities.Restaurante.Menu;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "articulos", schema = "buen_sabor")
public class Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "tipo")
    private String tipo;
    @Column(name = "precio")
    private double precio;
    @OneToMany(mappedBy = "articulo", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ImagenesProducto> imagenes = new ArrayList<>();
    @Column(name = "borrado")
    private String borrado;
}
