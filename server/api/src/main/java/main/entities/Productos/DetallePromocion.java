package main.entities.Productos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Medida;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "detalle_promocion", schema = "buen_sabor")
public class DetallePromocion implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "cantidad")
    private int cantidad;
    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_medida")
    private Medida medida;
    @ManyToOne
    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @JoinColumn(name = "id_menu")
    private ArticuloMenu articuloMenu;
    @ManyToOne
    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @JoinColumn(name = "id_articulo")
    private ArticuloVenta articuloVenta;
    @JsonIgnoreProperties(value = {"detallesPromocion", "sucursales", "imagenes"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_promocion")
    private Promocion promocion;
}
